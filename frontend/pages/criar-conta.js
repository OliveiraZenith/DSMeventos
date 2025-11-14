import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { register as apiRegister } from '../utils/api';

export default function CriarConta() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = await apiRegister(name, email, password);
      
      // Se a API retornar token, salva e redireciona para a home
      if (body && body.token && typeof window !== 'undefined') {
        localStorage.setItem('token', body.token);
        // Redireciona para a home já autenticado
        router.push('/');
      } else {
        // Se não retornar token, redireciona para o login
        router.push('/login');
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden md:flex">
        {/* Info Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-600 text-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Junte-se a nós!</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-200">
              Crie sua conta no DSMeventos e tenha acesso a uma plataforma completa para criar, gerenciar e participar dos melhores eventos.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm sm:text-base">Crie eventos ilimitados</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm sm:text-base">Gerencie inscrições</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm sm:text-base">Participe de eventos incríveis</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 sm:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
              Criar Conta
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
                  type="text"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                className="w-full bg-gradient-to-r from-gray-800 to-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-500 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando conta...
                  </span>
                ) : 'Criar Conta'}
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800 hover:underline transition">
                  Já tenho uma conta
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
