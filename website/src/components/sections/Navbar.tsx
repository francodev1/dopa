"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { MessageSquare, Menu, X } from "lucide-react"
import Image from "next/image"

const navigation = [
  { name: "Funcionalidades", href: "#features" },
  { name: "Como Funciona", href: "#how-it-works" },
  { name: "Preços", href: "#pricing" },
  { name: "Depoimentos", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                <Image 
                  src="/logo.svg" 
                  alt="DoP IA Logo" 
                  width={40} 
                  height={40}
                  className="drop-shadow-lg"
                />
              </div>
              <span className={`text-2xl font-bold transition-colors bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text ${
                isScrolled ? "text-transparent" : "text-white"
              }`}>DoP IA</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`font-medium transition-colors ${
                    isScrolled 
                      ? "text-gray-700 hover:text-indigo-600" 
                      : "text-white hover:text-indigo-200"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-4">
              {isSignedIn ? (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => window.location.href = '/dashboard'}
                    className={!isScrolled ? "text-white hover:text-white hover:bg-white/10" : ""}
                  >
                    Dashboard
                  </Button>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => window.location.href = '/login'}
                    className={!isScrolled ? "text-white hover:text-white hover:bg-white/10" : ""}
                  >
                    Entrar
                  </Button>
                  <Button onClick={() => window.location.href = '/signup'}>
                    Começar Grátis
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? "text-gray-900" : "text-white"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? "text-gray-900" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ top: "80px" }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu */}
            <div className="relative bg-white border-b border-gray-200 shadow-xl">
              <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
                {navigation.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block text-lg font-medium text-gray-900 hover:text-indigo-600 py-2"
                  >
                    {item.name}
                  </motion.a>
                ))}

                <div className="pt-4 space-y-3 border-t border-gray-200">
                  <Button variant="ghost" className="w-full" onClick={() => window.location.href = '/login'}>
                    Entrar
                  </Button>
                  <Button className="w-full" onClick={() => window.location.href = '/signup'}>
                    Começar Grátis
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
