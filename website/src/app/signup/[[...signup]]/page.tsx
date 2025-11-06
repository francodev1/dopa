import { Metadata } from "next"
import Link from "next/link"
import { SignUp } from "@clerk/nextjs"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Cadastro | AI E-commerce Agent",
  description: "Crie sua conta e comece seu teste grátis de 14 dias",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 mb-6 sm:mb-8 transition-colors font-medium bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Voltar para home
        </Link>

        {/* Clerk SignUp Component */}
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
