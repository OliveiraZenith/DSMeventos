'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEvents } from '../utils/api';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está logado
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }

    // Busca os eventos da API
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setError('');
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        setError(err.message || 'Erro ao carregar eventos');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Bem-vindo ao DSMeventos
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200 max-w-3xl mx-auto px-4">
            A plataforma completa para criar, gerenciar e participar dos melhores eventos
          </p>
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link
                href="/criar-conta"
                className="w-full sm:w-auto bg-white text-gray-800 hover:bg-gray-200 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Começar Agora
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold transition transform hover:scale-105"
              >
                Fazer Login
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link
                href="/criar-eventos"
                className="w-full sm:w-auto bg-white text-gray-800 hover:bg-gray-200 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Criar Novo Evento
              </Link>
              <Link
                href="/seus-eventos"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold transition transform hover:scale-105"
              >
                Ver Seus Eventos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg p-3 mr-3 sm:mr-4 shadow-md">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                Eventos Disponíveis
              </h3>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Explore e participe de eventos incríveis
            </p>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
              <p className="mt-4 text-gray-600">Carregando eventos...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center max-w-md mx-auto">
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 sm:p-12 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Nenhum evento disponível
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-2">
                Não há eventos cadastrados no momento
              </p>
              {isLoggedIn && (
                <>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">
                    Seja o primeiro a criar um evento incrível!
                  </p>
                  <Link
                    href="/criar-eventos"
                    className="inline-block bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:from-gray-700 hover:to-gray-500 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Criar Primeiro Evento
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && events.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-800 flex-1 line-clamp-2">
                        {event.title}
                      </h4>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold ml-2 whitespace-nowrap">
                        #{event.id}
                      </span>
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {event.date && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <div className="bg-gray-100 p-1.5 rounded mr-2">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span>{new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <div className="bg-gray-100 p-1.5 rounded mr-2">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}

                      {event.vagas && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <div className="bg-gray-100 p-1.5 rounded mr-2">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <span><strong>{event.vagas}</strong> vagas</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/evento/${event.id}`}
                      className="block w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white text-center hover:from-gray-700 hover:to-gray-600 px-4 py-2.5 rounded-lg transition font-semibold text-sm shadow-md hover:shadow-lg"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                ))}
              </div>

              {/* Create Event CTA */}
              {isLoggedIn && (
                <div className="text-center mt-8 sm:mt-12">
                  <Link
                    href="/criar-eventos"
                    className="inline-block bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-6 sm:px-8 py-3 rounded-lg transition font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Criar Seu Evento
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isLoggedIn && (
        <section className="bg-gradient-to-r from-gray-800 to-gray-600 text-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Pronto para começar?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-200 max-w-2xl mx-auto px-4">
              Crie sua conta gratuitamente e comece a organizar eventos incríveis hoje mesmo!
            </p>
            <Link
              href="/criar-conta"
              className="inline-block bg-white text-gray-800 hover:bg-gray-200 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
