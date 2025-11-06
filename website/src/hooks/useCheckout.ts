"use client"

import { useState } from 'react'

const PRICE_IDS = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || '',
  professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || '',
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS || '',
}

export function useCheckout() {
  const [loading, setLoading] = useState(false)

  const createCheckoutSession = async (planName: string) => {
    setLoading(true)
    
    try {
      const priceId = PRICE_IDS[planName.toLowerCase() as keyof typeof PRICE_IDS]
      
      if (!priceId) {
        throw new Error('Plano inválido')
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Redirecionar para o Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return { createCheckoutSession, loading }
}
