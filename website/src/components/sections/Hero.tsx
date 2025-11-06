"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FloatingElement } from "@/components/ui/floating-element"
import { DemoModal } from "@/components/ui/demo-modal"
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react"
import { TypeAnimation } from "react-type-animation"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function Hero() {
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [checkingSub, setCheckingSub] = useState(false)
  const [hasSubscription, setHasSubscription] = useState<null | boolean>(null)
  const [subscription, setSubscription] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    async function check() {
      if (!isSignedIn) {
        setHasSubscription(false)
        return
      }
      setCheckingSub(true)
      try {
        const res = await fetch('/api/check-subscription')
        const data = await res.json()
        if (!mounted) return
        setHasSubscription(Boolean(data.hasSubscription))
        setSubscription(data.subscription ?? null)
      } catch (err) {
        console.error('check-subscription error', err)
        if (mounted) setHasSubscription(false)
      } finally {
        if (mounted) setCheckingSub(false)
      }
    }
    check()
    return () => { mounted = false }
  }, [isSignedIn])

  const handleStartTrial = () => {
    if (!isSignedIn) {
      router.push('/signup')
      return
    }

    // Se já tem assinatura ativa, levar para dashboard
    if (hasSubscription) {
      router.push('/dashboard')
      return
    }

    // Usuário logado sem assinatura -> ir para pricing
    router.push('/#pricing')
  }

  return (
    <>
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>IA + Automação de Atendimento</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <TypeAnimation
                sequence={[
                  'Automatize seu atendimento',
                  2000,
                  'Economize tempo e dinheiro',
                  2000,
                  'Atenda 24/7 com IA',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              />
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Atenda seus clientes 24/7 via WhatsApp, Telegram e Instagram com
              inteligência artificial. Reduza custos e aumente satisfação.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="group" onClick={handleStartTrial} disabled={checkingSub}>
                {checkingSub ? 'Verificando...' : isSignedIn ? (hasSubscription ? 'Ir para Dashboard' : 'Ver Planos') : 'Começar Teste Grátis 14 dias'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setIsDemoOpen(true)}>
                <MessageSquare className="mr-2 w-5 h-5" />
                Ver Demo ao Vivo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-center lg:justify-start"
            >
              {subscription && (
                <div className="text-sm text-gray-700 mr-4">
                  Plano: <span className="font-semibold">{subscription.plan ?? subscription.stripePriceId ?? '—'}</span>
                  <br />
                  Status: <span className="font-medium">{subscription.status}</span>
                </div>
              )}
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-gray-900">
                  +500 empresas
                </p>
                <p className="text-sm text-gray-600">já automatizaram</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Visual/Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              {/* Chat mockup */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Bot IA</h3>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                      Online agora
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-end"
                >
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    Olá! Qual o status do meu pedido #1234?
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    Olá! 👋 Seu pedido #1234 está em trânsito e deve chegar
                    amanhã às 14h. Quer rastrear em tempo real?
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex justify-end"
                >
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    Sim, por favor!
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    📦 Enviado! Link de rastreamento: track.io/abc123
                    <br />
                    <span className="text-sm text-gray-600">
                      Respondido em 2 segundos ⚡
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating stats */}
            <FloatingElement delay={0} duration={3}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <p className="text-2xl font-bold text-indigo-600">90%</p>
                <p className="text-sm text-gray-600">Satisfação</p>
              </motion.div>
            </FloatingElement>

            <FloatingElement delay={1} duration={3.5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <p className="text-2xl font-bold text-green-600">24/7</p>
                <p className="text-sm text-gray-600">Disponível</p>
              </motion.div>
            </FloatingElement>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  )
}
