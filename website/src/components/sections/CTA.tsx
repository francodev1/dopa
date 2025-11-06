"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Junte-se a +500 empresas</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Pronto para automatizar seu atendimento?
          </h2>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Comece seu teste grátis de 14 dias agora mesmo. Sem cartão de crédito. Sem compromisso.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl group"
              onClick={() => window.location.href = '/signup'}
            >
              Começar Teste Grátis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="ghost"
              className="text-white border-2 border-white/30 hover:bg-white/10"
              onClick={() => window.open('https://calendly.com', '_blank')}
            >
              Agendar Demonstração
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              ✓ Sem cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              ✓ Configuração em 15 minutos
            </div>
            <div className="flex items-center gap-2">
              ✓ Cancele quando quiser
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
