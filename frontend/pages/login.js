import { useState } from 'react';
import { useRouter } from 'next/router';
import { login as apiLogin } from '../utils/api';

export default function Login() {
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
      const body = await apiLogin(email, password);
      // salva token no localStorage (simples) e redireciona
      if (body.token) {
        if (typeof window !== 'undefined') localStorage.setItem('token', body.token);
      }
      router.push('/');
    } catch (err) {
      setError(err.message || 'Erro no login');
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">DSMeventos</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-200">
              Bem-vindo ao DSMeventos. A plataforma completa para você criar, gerenciar e se inscrever nos melhores eventos. Faça seu login ou crie uma conta para participar.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm sm:text-base">Acesso rápido e seguro</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm sm:text-base">Gerencie seus eventos</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm sm:text-base">Conecte-se com pessoas</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 sm:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
              Faça seu login
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                    Entrando...
                  </span>
                ) : 'Entrar'}
              </button>

              <div className="text-center pt-2">
                <a className="text-sm text-gray-600 hover:text-gray-800 hover:underline transition" href='/criar-conta'>
                  Não tenho uma conta
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
