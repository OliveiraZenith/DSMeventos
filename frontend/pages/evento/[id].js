import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getEventById, subscribeToEvent, getUserSubscriptions } from '../../utils/api';
import { getValidToken } from '../../utils/auth';

export default function EventoDetalhes() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está logado e se o token é válido
    const token = getValidToken();
    setIsLoggedIn(!!token);

    // Busca os detalhes do evento
    async function fetchEventDetails() {
      if (!id) return;

      try {
        setLoading(true);
        console.log('Buscando evento com ID:', id);
        const data = await getEventById(id);
        console.log('Dados do evento recebidos:', data);
        setEvent(data);
        setError('');

        // Verifica se o usuário já está inscrito
        if (token) {
          try {
            const subscriptions = await getUserSubscriptions(token);
            const isSubscribed = subscriptions.some(sub => sub.eventId === id || sub.eventId === data.id);
            setAlreadySubscribed(isSubscribed);
            console.log('Usuário já inscrito:', isSubscribed);
          } catch (err) {
            console.error('Erro ao verificar inscrições:', err);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar evento:', err);
        setError(err.message || 'Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    }

    fetchEventDetails();
  }, [id]);

  async function handleSubscribe() {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setSubscribing(true);
    try {
      const token = localStorage.getItem('token');
      await subscribeToEvent(id, token);
      setSubscribed(true);
      setAlreadySubscribed(true);
      alert('Inscrição realizada com sucesso!');
    } catch (err) {
      alert(err.message || 'Erro ao se inscrever');
    } finally {
      setSubscribing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <p className="mt-4 text-gray-600">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl max-w-md mx-auto shadow-md">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="font-semibold text-center text-lg mb-2">Erro ao carregar evento</p>
          <p className="text-sm text-center mb-6">{error || 'Evento não encontrado'}</p>
          <Link
            href="/"
            className="block text-center bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-700 hover:to-gray-600 px-6 py-3 rounded-lg transition font-semibold shadow-md"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  // Tratamento seguro da data
  let eventDate = null;
  let isUpcoming = false;

  try {
    if (event.date) {
      eventDate = new Date(event.date);
      isUpcoming = eventDate >= new Date();
    }
  } catch (e) {
    console.error('Erro ao processar data:', e);
  }

  console.log('Evento final:', event);
  console.log('Data do evento:', eventDate);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-800 font-semibold">Detalhes do Evento</span>
          </div>

          {/* Event Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Event Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                  <div className="flex flex-wrap gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      isUpcoming
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}>
                      {isUpcoming ? 'Evento Próximo' : 'Evento Finalizado'}
                    </span>
                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                      ID: #{event.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-8">
              {/* Date and Location */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-gray-800 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase">Data do Evento</p>
                    {eventDate ? (
                      <>
                        <p className="text-xl font-bold text-gray-800 mt-1">
                          {eventDate.toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-gray-800 mt-1">
                        Data não informada
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-800 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase">Local</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">
                      {event.location || 'Local não informado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sobre o Evento</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.description || 'Sem descrição disponível.'}
                  </p>
                </div>
              </div>

              {/* Vagas */}
              {event.vagas && (
                <div className="mb-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-600 font-semibold uppercase">Vagas Disponíveis</p>
                      <p className="text-3xl font-bold text-blue-800">{event.vagas}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isUpcoming && !alreadySubscribed && (
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing || subscribed}
                    className={`flex-1 px-8 py-4 rounded-lg font-semibold transition text-lg ${
                      subscribed
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50'
                    }`}
                  >
                    {subscribing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Inscrevendo...
                      </span>
                    ) : subscribed ? (
                      '✓ Inscrito com Sucesso'
                    ) : (
                      'Inscrever-se no Evento'
                    )}
                  </button>
                )}

                {isUpcoming && alreadySubscribed && (
                  <div className="flex-1 bg-green-100 border-2 border-green-600 text-green-800 px-8 py-4 rounded-lg font-semibold text-lg text-center">
                    <span className="flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Você já está inscrito
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copiado para a área de transferência!');
                    }
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-8 py-4 rounded-lg font-semibold transition text-lg"
                >
                  Compartilhar
                </button>
              </div>

              {!isLoggedIn && isUpcoming && (
                <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-center">
                  <p>
                    <Link href="/login" className="font-semibold underline">
                      Faça login
                    </Link>
                    {' ou '}
                    <Link href="/criar-conta" className="font-semibold underline">
                      crie uma conta
                    </Link>
                    {' para se inscrever neste evento.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold transition"
            >
              ← Voltar para Eventos
            </Link>
          </div>
        </div>
    </main>
  );
}
