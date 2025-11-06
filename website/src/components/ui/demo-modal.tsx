"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Modal } from "@/components/ui/modal"
import { Send, Bot, User } from "lucide-react"

interface Message {
  role: "user" | "bot"
  content: string
}

const demoMessages: Message[] = [
  { role: "user", content: "Olá! Qual o status do meu pedido #1234?" },
  { role: "bot", content: "Olá! 👋 Seu pedido #1234 está em trânsito e deve chegar amanhã às 14h. Quer o link de rastreamento?" },
  { role: "user", content: "Sim, por favor!" },
  { role: "bot", content: "📦 Aqui está: track.io/abc123\n\nPosso ajudar com algo mais?" },
  { role: "user", content: "Vocês têm o produto X em estoque?" },
  { role: "bot", content: "Sim! O produto X está disponível em 3 cores: Preto, Branco e Azul. Preço: R$ 299,90. Quer que eu envie o link?" }
]

export function DemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const startDemo = () => {
    setMessages([])
    setCurrentDemo(0)
    simulateConversation(0)
  }

  const simulateConversation = (index: number) => {
    if (index >= demoMessages.length) return

    const message = demoMessages[index]
    
    setTimeout(() => {
      if (message.role === "bot") {
        setIsTyping(true)
        setTimeout(() => {
          setMessages(prev => [...prev, message])
          setIsTyping(false)
          setCurrentDemo(index + 1)
          simulateConversation(index + 1)
        }, 1500)
      } else {
        setMessages(prev => [...prev, message])
        setCurrentDemo(index + 1)
        simulateConversation(index + 1)
      }
    }, 800)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Demo Interativa" size="lg">
      <div className="space-y-6">
        {/* Description */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Veja como nosso bot responde automaticamente aos clientes
          </p>
          <button
            onClick={startDemo}
            disabled={currentDemo > 0 && currentDemo < demoMessages.length}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentDemo === 0 ? "Iniciar Demonstração" : currentDemo < demoMessages.length ? "Executando..." : "Reiniciar Demo"}
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-gray-50 rounded-xl p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 && currentDemo === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Clique em "Iniciar Demonstração" para começar
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "bot" 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600" 
                      : "bg-gray-300"
                  }`}>
                    {message.role === "bot" ? (
                      <Bot className="w-6 h-6 text-white" />
                    ) : (
                      <User className="w-6 h-6 text-gray-600" />
                    )}
                  </div>

                  {/* Message */}
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === "bot"
                      ? "bg-white text-gray-900 rounded-tl-sm"
                      : "bg-indigo-600 text-white rounded-tr-sm"
                  }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">2s</p>
            <p className="text-sm text-gray-600">Tempo de resposta</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">100%</p>
            <p className="text-sm text-gray-600">Disponibilidade</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">90%</p>
            <p className="text-sm text-gray-600">Satisfação</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
