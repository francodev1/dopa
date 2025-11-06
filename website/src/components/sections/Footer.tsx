"use client"

import { MessageSquare, Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react"

const navigation = {
  product: [
    { name: "Funcionalidades", href: "#features" },
    { name: "Preços", href: "#pricing" },
    { name: "Como Funciona", href: "#how-it-works" },
    { name: "Demo", href: "#demo" }
  ],
  company: [
    { name: "Sobre Nós", href: "#about" },
    { name: "Blog", href: "/blog" },
    { name: "Carreiras", href: "#careers" },
    { name: "Contato", href: "#contact" }
  ],
  resources: [
    { name: "Documentação", href: "/docs" },
    { name: "API", href: "/api" },
    { name: "Tutoriais", href: "/tutorials" },
    { name: "Status", href: "/status" }
  ],
  legal: [
    { name: "Privacidade", href: "/privacy" },
    { name: "Termos de Uso", href: "/terms" },
    { name: "LGPD", href: "/lgpd" },
    { name: "Segurança", href: "/security" }
  ]
}

const social = [
  { name: "GitHub", icon: Github, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" }
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Agent</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-xs">
              Automatize seu atendimento com inteligência artificial e aumente a satisfação dos seus clientes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:contato@aiagent.com.br" className="hover:text-white">
                  contato@aiagent.com.br
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, Brasil</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produto</h3>
            <ul className="space-y-2">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © 2025 AI E-commerce Agent. Todos os direitos reservados.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Certifications */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="px-3 py-1 bg-gray-800 rounded-full">🔒 SSL</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full">LGPD</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full">ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
