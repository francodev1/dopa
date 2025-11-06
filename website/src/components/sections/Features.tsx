"use client"

import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { 
  Clock, 
  MessageCircle, 
  Brain, 
  BarChart3, 
  Users, 
  Globe 
} from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Atendimento 24/7",
    description: "Seu bot nunca dorme. Responde clientes a qualquer hora do dia, todos os dias da semana.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: MessageCircle,
    title: "Multi-Canal",
    description: "WhatsApp, Telegram, Instagram e mais. Centralize tudo em um único dashboard.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Brain,
    title: "IA Treinada",
    description: "Aprende com seu negócio. Quanto mais usa, mais inteligente fica.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: BarChart3,
    title: "Analytics em Tempo Real",
    description: "Dashboard completo com métricas de atendimento, satisfação e conversão.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Users,
    title: "Transferência Inteligente",
    description: "Identifica quando o cliente precisa de um humano e transfere automaticamente.",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: Globe,
    title: "Multi-Idioma",
    description: "Atende em português, inglês, espanhol e mais de 50 idiomas automaticamente.",
    color: "from-teal-500 to-green-500"
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
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
            Tudo que você precisa para
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}automatizar
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa para transformar seu atendimento com inteligência artificial
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={feature.title}
              direction="up"
              delay={index * 0.1}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative group h-full"
              >
                <div className="relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              </div>
            </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
