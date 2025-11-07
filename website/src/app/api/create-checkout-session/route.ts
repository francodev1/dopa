import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

// OWASP: Lista de Price IDs válidos (whitelist)
const VALID_PRICE_IDS = [
  process.env.STRIPE_PRICE_STARTER!,
  process.env.STRIPE_PRICE_PROFESSIONAL!,
  process.env.STRIPE_PRICE_BUSINESS!,
]

// OWASP: Rate limiting simples (em produção, use Redis)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const limit = requestCounts.get(userId)
  
  if (!limit || now > limit.resetAt) {
    requestCounts.set(userId, { count: 1, resetAt: now + 60000 }) // 1 minuto
    return true
  }
  
  if (limit.count >= 5) { // Max 5 requests por minuto
    return false
  }
  
  limit.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    // OWASP A01: Broken Access Control - Verificar autenticação
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // OWASP A07: Identification and Authentication Failures
    const user = await currentUser()
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json(
        { error: 'Usuário inválido' },
        { status: 401 }
      )
    }

    // OWASP A04: Insecure Design - Rate Limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente em 1 minuto.' },
        { status: 429 }
      )
    }

    // OWASP A03: Injection - Validar e sanitizar input
    const body = await req.json()
    const { priceId } = body

    // Validar que priceId existe e é string
    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json(
        { error: 'Price ID é obrigatório e deve ser uma string' },
        { status: 400 }
      )
    }

    // OWASP A01: Broken Access Control - Whitelist de Price IDs
    if (!VALID_PRICE_IDS.includes(priceId)) {
      return NextResponse.json(
        { error: 'Price ID inválido' },
        { status: 400 }
      )
    }

    // OWASP A05: Security Misconfiguration - Validar ambiente
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('NEXT_PUBLIC_APP_URL não configurado')
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      )
    }

    // OWASP A09: Security Logging - Log da operação (sem dados sensíveis)
    console.log(`[CHECKOUT] User ${userId} iniciou checkout para ${priceId}`)

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      phone_number_collection: { enabled: true },
      customer_email: user.emailAddresses[0].emailAddress,
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
      locale: 'pt-BR', // Traduzir Stripe para português
      metadata: {
        userId,
        userEmail: user.emailAddresses[0].emailAddress,
      },
      // OWASP: Adicionar subscription_data para trial
      subscription_data: {
        trial_period_days: 14, // 14 dias grátis
        metadata: {
          userId,
        },
      },
    })

    // OWASP A09: Security Logging
    console.log(`[CHECKOUT] Sessão criada: ${session.id}`)

    // OWASP A02: Cryptographic Failures - Não expor dados sensíveis
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    })
    
  } catch (error: any) {
    // OWASP A09: Security Logging and Monitoring Failures
    console.error('[CHECKOUT ERROR]', {
      message: error.message,
      type: error.type,
      // Não logar stack completo em produção
    })
    
    // OWASP A02: Não expor detalhes internos ao cliente
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Erro ao processar pagamento. Tente novamente.' 
      },
      { status: 500 }
    )
  }
}

// OWASP: Bloquear outros métodos HTTP
export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  )
}
