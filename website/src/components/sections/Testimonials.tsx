"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"

const testimonials = [
  {
    name: "Carlos Silva",
    company: "TechStore Brasil",
    role: "CEO",
    content: "Reduzimos 70% do tempo de atendimento e aumentamos a satisfação dos clientes. O ROI foi imediato!",
    rating: 5,
    image: "👨‍💼"
  },
  {
    name: "Marina Costa",
    company: "BeautyShop",
    role: "Gerente de Atendimento",
    content: "Antes gastávamos R$8.000/mês com atendentes. Agora são R$997 e atendemos 3x mais clientes.",
    rating: 5,
    image: "👩‍💼"
  },
  {
    name: "Roberto Almeida",
    company: "FastDelivery",
    role: "Diretor de Operações",
    content: "A IA entende contexto e resolve 85% dos casos sem intervenção humana. Impressionante!",
    rating: 5,
    image: "👨‍💻"
  }
]

const stats = [
  { value: 90, label: "Satisfação dos clientes", suffix: "%" },
  { value: 50, label: "Redução de custos", suffix: "%" },
  { value: 24, label: "Disponibilidade", suffix: "/7" },
  { value: 2, label: "Tempo médio de resposta", suffix: "s" }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
            Empresas que já automatizaram
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Veja como outras empresas transformaram seu atendimento
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  duration={2.5}
                />
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-indigo-200 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
