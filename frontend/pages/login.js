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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden md:flex">
        <div className="md:w-1/2 bg-gray-800 text-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">DSMeventos</h2>
          <p className="text-small leading-relaxed">
            Bem-vindo ao DSMeventos. A plataforma completa para você criar, gerenciar e se inscrever nos melhores eventos. Faça seu login ou crie uma conta para participar.
          </p>
        </div>

        <div className="md:w-1/2 p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-bold text-center mb-6">Faça seu login</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center">
                  <span className="w-6 h-10 rounded-l-full bg-gray-800 block" />
                  <input
                    className="flex-1 border rounded-r-full px-3 py-2"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <span className="w-6 h-10 rounded-l-full bg-gray-800 block" />
                  <input
                    className="flex-1 border rounded-r-full px-3 py-2"
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              {error && <div className="error">{error}</div>}

              <button className="cursor-pointer hover:bg-gray-500 w-full bg-slate-900 text-white py-2 rounded-md" type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <div className="text-center">
                <a className="text-center text-sm text-gray-500 hover:text-gray-800 hover:font-bold" href='/criar-conta'>Não tenho uma conta</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
