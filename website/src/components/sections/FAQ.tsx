"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Como funciona o período de teste grátis?",
    answer: "Você tem 14 dias completos para testar todas as funcionalidades sem pagar nada. Não é necessário cartão de crédito para começar. Se não gostar, basta cancelar antes do fim do período."
  },
  {
    question: "Preciso saber programar para configurar?",
    answer: "Não! Nossa plataforma é 100% no-code. Você configura tudo através de uma interface visual simples. Nosso time também oferece suporte para te ajudar no setup inicial."
  },
  {
    question: "Posso trocar de plano depois?",
    answer: "Sim! Você pode fazer upgrade ou downgrade a qualquer momento. As mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente."
  },
  {
    question: "Como a IA aprende sobre meu negócio?",
    answer: "Você fornece informações sobre seus produtos, serviços e FAQs. A IA usa GPT-4 para entender contexto e responder de forma natural. Quanto mais usa, mais precisa fica."
  },
  {
    question: "O que acontece quando o bot não sabe responder?",
    answer: "O sistema detecta automaticamente quando precisa de um humano e transfere a conversa para sua equipe. Você pode configurar regras personalizadas de transferência."
  },
  {
    question: "É seguro? Meus dados ficam protegidos?",
    answer: "Sim! Usamos criptografia de ponta-a-ponta, servidores na AWS com certificação ISO 27001 e estamos em conformidade com a LGPD. Seus dados nunca são compartilhados."
  },
  {
    question: "Funciona com meu número de WhatsApp atual?",
    answer: "Sim! Você pode usar seu número de WhatsApp Business atual. A integração é feita via WhatsApp Business API oficial."
  },
  {
    question: "Quantas conversas simultâneas o bot aguenta?",
    answer: "Ilimitadas! O bot pode atender centenas de clientes ao mesmo tempo sem perder qualidade ou velocidade de resposta."
  },
  {
    question: "Tem suporte em português?",
    answer: "Sim! Nosso suporte é 100% em português e está disponível por chat, email e WhatsApp. No plano Enterprise você tem um gerente dedicado."
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim, sem multas ou burocracias. Basta clicar em cancelar no painel e pronto. Você mantém acesso até o fim do período pago."
  }
]

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-indigo-600 transition-colors"
      >
        <span className="font-semibold text-lg text-gray-900 pr-8">
          {question}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-gray-600 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Tudo que você precisa saber antes de começar
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm">
          <div className="p-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Ainda tem dúvidas?
          </p>
          <a
            href="mailto:contato@aiagent.com.br"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Fale com nosso time →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
