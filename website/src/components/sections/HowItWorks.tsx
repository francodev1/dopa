"use client"

import { motion } from "framer-motion"
import { Link2, Settings, MessageSquare, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Conecte seu WhatsApp",
    description: "Integração simples em 1 clique. Conecte via QR Code e pronto!",
    color: "from-blue-500 to-cyan-500"
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure a IA",
    description: "Treine o bot com informações do seu negócio, produtos e FAQs.",
    color: "from-purple-500 to-pink-500"
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Personalize Respostas",
    description: "Defina o tom, horários de atendimento e mensagens automáticas.",
    color: "from-orange-500 to-red-500"
  },
  {
    number: "04",
    icon: Rocket,
    title: "Comece a Atender",
    description: "Tudo pronto! Seu bot já está respondendo clientes automaticamente.",
    color: "from-green-500 to-emerald-500"
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
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
            Como funciona?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Em apenas 4 passos simples, você automatiza todo seu atendimento
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line - hidden on mobile and last item */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-200 to-transparent" />
              )}

              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                {/* Number badge */}
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            Tempo estimado de configuração: <span className="font-semibold text-indigo-600">15 minutos</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
