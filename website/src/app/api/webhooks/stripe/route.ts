import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

// OWASP A08: Software Integrity - Validação de assinatura do webhook
export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('[WEBHOOK] Stripe signature missing')
    return NextResponse.json(
      { error: 'Stripe signature missing' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // ✅ VALIDAR ASSINATURA DO WEBHOOK (OWASP A08)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[WEBHOOK] Signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // OWASP A09: Security Logging
  console.log(`[WEBHOOK] Event received: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // OWASP A09: Log importante (sem dados sensíveis)
        console.log('[WEBHOOK] Checkout completed:', {
          sessionId: session.id,
          userId: session.client_reference_id,
          subscriptionId: session.subscription,
        })

        // TODO: Salvar no banco de dados
        // await prisma.subscription.create({
        //   data: {
        //     userId: session.client_reference_id!,
        //     stripeCustomerId: session.customer as string,
        //     stripeSubscriptionId: session.subscription as string,
        //     stripePriceId: session.line_items?.data[0]?.price?.id,
        //     status: 'active',
        //   },
        // })

        // Enviar notificação para o backend
        await notifyBackend({
          event: 'subscription.created',
          userId: session.client_reference_id!,
          subscriptionId: session.subscription as string,
          email: session.customer_details?.email,
          phone: session.customer_details?.phone,
          customer: session.customer as string,
        })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('[WEBHOOK] Subscription updated:', {
          subscriptionId: subscription.id,
          status: subscription.status,
        })

        // TODO: Atualizar no banco de dados
        // await prisma.subscription.update({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: {
        //     status: subscription.status,
        //     currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        //   },
        // })

        await notifyBackend({
          event: 'subscription.updated',
          subscriptionId: subscription.id,
          status: subscription.status,
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('[WEBHOOK] Subscription deleted:', {
          subscriptionId: subscription.id,
        })

        // TODO: Atualizar no banco de dados
        // await prisma.subscription.update({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: {
        //     status: 'canceled',
        //     canceledAt: new Date(),
        //   },
        // })

        await notifyBackend({
          event: 'subscription.canceled',
          subscriptionId: subscription.id,
        })

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        console.log('[WEBHOOK] Payment succeeded:', {
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
        })

        // TODO: Registrar pagamento
        // await prisma.payment.create({
        //   data: {
        //     stripeInvoiceId: invoice.id,
        //     amount: invoice.amount_paid / 100,
        //     status: 'succeeded',
        //   },
        // })

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        console.error('[WEBHOOK] Payment failed:', {
          invoiceId: invoice.id,
        })

        // TODO: Notificar usuário
        // await sendEmail({
        //   to: invoice.customer_email,
        //   subject: 'Falha no pagamento',
        //   body: 'Seu pagamento falhou. Por favor, atualize seu método de pagamento.',
        // })

        break
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
    
  } catch (error: any) {
    // OWASP A09: Security Logging
    console.error('[WEBHOOK ERROR]', {
      type: event.type,
      error: error.message,
    })
    
    // OWASP A02: Não expor detalhes internos
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Função para notificar o backend Node.js
async function notifyBackend(data: any) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
    
    const response = await fetch(`${backendUrl}/api/webhook/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    console.log('[WEBHOOK] Backend notified successfully')
  } catch (error: any) {
    console.error('[WEBHOOK] Failed to notify backend:', error.message)
    // Não falhar o webhook se backend estiver offline
  }
}

// OWASP: Bloquear outros métodos HTTP
export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  )
}
