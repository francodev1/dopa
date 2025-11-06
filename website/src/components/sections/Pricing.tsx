"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Zap, Star } from "lucide-react"
import { useCheckout } from "@/hooks/useCheckout"
import { useUser } from "@clerk/nextjs"

const plans = [
  {
    name: "Starter",
    price: "97",
    description: "Perfeito para começar",
    popular: false,
    features: [
      "500 conversas/mês",
      "1 usuário",
      "WhatsApp",
      "Dashboard básico",
      "Suporte por email",
      "IA GPT-4o-mini"
    ]
  },
  {
    name: "Professional",
    price: "297",
    description: "Mais escolhido",
    popular: true,
    features: [
      "1.500 conversas/mês",
      "3 usuários",
      "WhatsApp + Telegram + Instagram",
      "Dashboard avançado",
      "Suporte prioritário",
      "IA GPT-4o",
      "Analytics avançado",
      "Integrações ilimitadas"
    ]
  },
  {
    name: "Business",
    price: "697",
    description: "Para grandes operações",
    popular: false,
    features: [
      "4.000 conversas/mês",
      "Usuários ilimitados",
      "Todos os canais",
      "Dashboard customizado",
      "Gerente dedicado",
      "White-label",
      "API customizada",
      "SLA garantido",
      "Treinamento personalizado"
    ]
  }
]

export function Pricing() {
  const { createCheckoutSession, loading } = useCheckout()
  const { isSignedIn } = useUser()

  const handlePlanClick = (planName: string) => {
    if (!isSignedIn) {
      // Se não estiver logado, redireciona para signup
      window.location.href = `/signup?plan=${planName.toLowerCase()}`
    } else {
      // Se estiver logado, vai direto para o checkout
      createCheckoutSession(planName)
    }
  }

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planos para todos os tamanhos
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Comece grátis por 14 dias. Sem cartão de crédito necessário.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>Economize até R$5.000/mês em atendimento</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div className={`relative h-full bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-indigo-600 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}>
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      R${plan.price}
                    </span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-indigo-600' : 'text-green-600'
                      }`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  className="w-full" 
                  size="lg"
                  variant={plan.popular ? "default" : "secondary"}
                  onClick={() => handlePlanClick(plan.name)}
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Começar teste grátis'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Todos os planos incluem 14 dias grátis • Cancele quando quiser • Suporte em português
          </p>
        </motion.div>
      </div>
    </section>
  )
}
