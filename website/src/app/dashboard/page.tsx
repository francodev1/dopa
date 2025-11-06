import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Este é seu dashboard. Aqui você gerencia tudo do seu AI Agent.
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Conversas Hoje</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-green-600 mt-2">+0% vs ontem</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Satisfação</div>
            <div className="text-3xl font-bold text-gray-900">0%</div>
            <div className="text-sm text-gray-500 mt-2">Nenhum dado ainda</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Tempo Médio</div>
            <div className="text-3xl font-bold text-gray-900">0s</div>
            <div className="text-sm text-gray-500 mt-2">Nenhum dado ainda</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Taxa de Resolução</div>
            <div className="text-3xl font-bold text-gray-900">0%</div>
            <div className="text-sm text-gray-500 mt-2">Nenhum dado ainda</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Primeiros Passos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:shadow-md transition-all">
              <div className="text-2xl mb-2">🔗</div>
              <div className="font-semibold text-gray-900 mb-1">Conectar WhatsApp</div>
              <div className="text-sm text-gray-600">Integre seu número em 1 clique</div>
            </button>
            
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:shadow-md transition-all">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold text-gray-900 mb-1">Configurar IA</div>
              <div className="text-sm text-gray-600">Treine o bot com seus dados</div>
            </button>
            
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:shadow-md transition-all">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-gray-900 mb-1">Ver Analytics</div>
              <div className="text-sm text-gray-600">Métricas em tempo real</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
