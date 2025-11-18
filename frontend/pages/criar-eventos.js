import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createEvent } from '../utils/api';
import { validateTokenOrRedirect } from '../utils/auth';

export default function CriarEventos() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [vagas, setVagas] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está logado e se o token é válido
    validateTokenOrRedirect(router);
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Você precisa estar logado para criar um evento');
      }

      // Monta o endereço completo
      const location = `${rua}, ${numero} - ${cidade}, ${estado}`;

      const newEvent = await createEvent(title, description, date, location, token, parseInt(vagas) || 50);

      // Salva o evento criado no localStorage
      const storedEvents = localStorage.getItem('userCreatedEvents');
      const currentEvents = storedEvents ? JSON.parse(storedEvents) : [];
      currentEvents.push(newEvent);
      localStorage.setItem('userCreatedEvents', JSON.stringify(currentEvents));

      setSuccess(true);

      // Limpa o formulário
      setTitle('');
      setDescription('');
      setDate('');
      setEstado('');
      setCidade('');
      setRua('');
      setNumero('');
      setVagas('');
      setImage(null);

      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push('/seus-eventos');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Título Principal */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Crie seu Evento
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
            Preencha os detalhes para criar um novo evento
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6 sm:p-8">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg mb-6 text-center">
              <p className="font-bold text-base sm:text-lg">✓ Evento criado com sucesso!</p>
              <p className="text-xs sm:text-sm mt-1">Redirecionando para seus eventos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg mb-6 text-center">
              <p className="font-semibold text-sm sm:text-base">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Nome do Evento */}
            <div>
              <label className="block text-gray-800 text-base sm:text-lg font-bold mb-2">
                Nome do Evento *
              </label>
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                placeholder="Ex: Workshop de React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-gray-800 text-base sm:text-lg font-bold mb-2">
                Descrição *
              </label>
              <textarea
                className="w-full h-32 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                placeholder="Descreva os detalhes do evento..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={500}
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{description.length}/500 caracteres</p>
            </div>

            {/* Data */}
            <div>
              <label className="block text-gray-800 text-base sm:text-lg font-bold mb-2">
                Data do Evento *
              </label>
              <input
                type="date"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Local */}
            <div>
              <label className="block text-gray-800 text-base sm:text-lg font-bold mb-2">
                Localização *
              </label>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                  placeholder="Estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <input
                  type="text"
                  className="sm:col-span-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                  placeholder="Rua"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                  placeholder="Número"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-gray-800 text-base sm:text-lg font-bold mb-2">
                Imagem do Evento (Opcional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="imageUpload"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-300"
                >
                  {image ? (
                    <span className="flex items-center text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {image.name}
                    </span>
                  ) : (
                    <span className="flex items-center text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Clique para adicionar uma imagem
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Quantidade de vagas */}
            <div>
              <label className="block text-gray-800 text-base sm:text-lg font-bold mb-2">
                Quantidade Máxima de Participantes *
              </label>
              <input
                type="number"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                placeholder="Ex: 50"
                value={vagas}
                onChange={(e) => setVagas(e.target.value)}
                required
                min="1"
                max="10000"
              />
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-700 hover:to-gray-600 px-4 sm:px-6 py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={loading || success}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Criando...
                  </span>
                ) : (
                  'Criar Evento'
                )}
              </button>

              <Link
                href="/seus-eventos"
                className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 px-4 sm:px-6 py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
