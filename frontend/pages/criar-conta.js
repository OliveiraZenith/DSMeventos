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
      // Se a API retornar token, podemos salvar e redirecionar
      if (body && body.token && typeof window !== 'undefined') {
        localStorage.setItem('token', body.token);
      }
      // Depois de criar, redireciona para a tela de login ou para a home
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Crie sua conta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center">
              <span className="w-6 h-10 rounded-l-full bg-gray-800 block" />
              <input
                className="flex-1 border rounded-r-full px-3 py-2 w-full"
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <span className="w-6 h-10 rounded-l-full bg-gray-800 block" />
              <input
                className="flex-1 border rounded-r-full px-3 py-2 w-full"
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
                className="flex-1 border rounded-r-full px-3 py-2 w-full"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="cursor-pointer bg-slate-900 text-white py-2 px-4 rounded-md w-full hover:bg-gray-700"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar'}
          </button>

          <div className="text-center mt-2">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 hover:font-bold">Voltar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
