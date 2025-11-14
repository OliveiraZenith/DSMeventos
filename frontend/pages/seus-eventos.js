import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getUserSubscriptions,  deleteEvent, unsubscribeFromEvent, updateEvent } from '../utils/api';

export default function SeusEventos() {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', location: '', vagas: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está logado
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      setIsLoggedIn(true);
    }

    // Busca os eventos do usuário
    async function fetchUserEvents() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Busca eventos criados pelo usuário do localStorage
        try {
          const storedEvents = localStorage.getItem('userCreatedEvents');
          if (storedEvents) {
            const events = JSON.parse(storedEvents);
            setCreatedEvents(events || []);
          } else {
            setCreatedEvents([]);
          }
        } catch (eventsError) {
          console.log('Erro ao carregar eventos criados:', eventsError);
          setCreatedEvents([]);
        }

        // Busca inscrições do usuário
        try {
          const subscriptions = await getUserSubscriptions(token);
          setSubscribedEvents(subscriptions || []);
        } catch (subError) {
          console.log('Nenhuma inscrição encontrada');
          setSubscribedEvents([]);
        }

        setError('');
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        setError(err.message || 'Erro ao carregar eventos');
      } finally {
        setLoading(false);
      }
    }

    fetchUserEvents();
  }, [router]);

  async function handleDeleteEvent(eventId) {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return;

    try {
      const token = localStorage.getItem('token');
      await deleteEvent(eventId, token);
      
      // Remove do estado e do localStorage
      const updatedEvents = createdEvents.filter(e => e.id !== eventId);
      setCreatedEvents(updatedEvents);
      localStorage.setItem('userCreatedEvents', JSON.stringify(updatedEvents));
    } catch (err) {
      alert(err.message || 'Erro ao deletar evento');
    }
  }

  async function handleUnsubscribe(subscriptionId) {
    if (!confirm('Tem certeza que deseja cancelar esta inscrição?')) return;

    try {
      const token = localStorage.getItem('token');
      await unsubscribeFromEvent(subscriptionId, token);
      setSubscribedEvents(subscribedEvents.filter(s => s.id !== subscriptionId));
    } catch (err) {
      alert(err.message || 'Erro ao cancelar inscrição');
    }
  }

  function handleEditClick(event) {
    setEditingEvent(event);
    setEditForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      location: event.location || '',
      vagas: event.vagas || ''
    });
    setEditError('');
    setShowEditModal(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      const token = localStorage.getItem('token');
      const updatedEvent = await updateEvent(editingEvent.id, editForm, token);
      
      // Atualiza o evento na lista e no localStorage
      const updatedEvents = createdEvents.map(event => 
        event.id === editingEvent.id ? updatedEvent : event
      );
      setCreatedEvents(updatedEvents);
      localStorage.setItem('userCreatedEvents', JSON.stringify(updatedEvents));

      setShowEditModal(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Erro ao atualizar evento:', err);
      setEditError(err.message || 'Erro ao atualizar evento');
    } finally {
      setEditLoading(false);
    }
  }

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Seus Eventos
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Gerencie seus eventos e inscrições de forma simples e eficiente
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            <p className="mt-4 text-gray-600">Carregando seus eventos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center max-w-md mx-auto mb-8">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Section: Inscritos */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 mr-3 sm:mr-4 shadow-md">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    Eventos Inscritos
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 mt-1">
                    {subscribedEvents.length} {subscribedEvents.length === 1 ? 'evento' : 'eventos'}
                  </p>
                </div>
              </div>

              {subscribedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {subscribedEvents.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex-1 line-clamp-2">
                          {subscription.eventTitle || 'Evento'}
                        </h3>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold ml-2 whitespace-nowrap">
                          Inscrito
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Inscrito em {new Date().toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/evento/${subscription.eventId}`}
                          className="flex-1 bg-gradient-to-r from-gray-800 to-gray-700 text-white text-center hover:from-gray-700 hover:to-gray-600 px-4 py-2.5 rounded-lg transition font-semibold text-sm shadow-md"
                        >
                          Ver Evento
                        </Link>
                        <button
                          onClick={() => handleUnsubscribe(subscription.id)}
                          className="sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-lg transition font-semibold text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 sm:p-12 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Nenhuma inscrição ainda
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-2">
                    Você não está inscrito em nenhum evento
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">
                    Explore eventos disponíveis e faça sua primeira inscrição!
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Explorar Eventos
                  </Link>
                </div>
              )}
            </div>

            {/* Section: Criados */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 mr-3 sm:mr-4 shadow-md">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    Eventos Criados por Você
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 mt-1">
                    {createdEvents.length} {createdEvents.length === 1 ? 'evento' : 'eventos'}
                  </p>
                </div>
              </div>

              {createdEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {createdEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex-1 line-clamp-2">
                          {event.title}
                        </h3>
                        <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold ml-2 whitespace-nowrap">
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

                        {event.vagas && (
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <div className="bg-gray-100 p-1.5 rounded mr-2">
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <span><strong>{event.vagas}</strong> vagas disponíveis</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                        <Link
                          href={`/evento/${event.id}`}
                          className="flex-1 bg-gradient-to-r from-gray-800 to-gray-700 text-white text-center hover:from-gray-700 hover:to-gray-600 px-3 py-2 rounded-lg transition font-semibold text-sm shadow-md"
                        >
                          Ver Detalhes
                        </Link>
                        <button
                          onClick={() => handleEditClick(event)}
                          className="sm:w-auto bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg transition font-semibold text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg transition font-semibold text-sm"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 sm:p-12 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Nenhum evento criado
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-2">
                    Você ainda não criou nenhum evento
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">
                    Comece agora e compartilhe eventos incríveis!
                  </p>
                  <Link
                    href="/criar-eventos"
                    className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Criar Primeiro Evento
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 sm:p-6 lg:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2 mr-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Editar Evento</h2>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Error Message */}
              {editError && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm">{editError}</p>
                </div>
              )}

              {/* Edit Form */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título do Evento
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Nome do evento"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Descreva seu evento"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data e Hora
                    </label>
                    <input
                      type="datetime-local"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Vagas
                    </label>
                    <input
                      type="number"
                      value={editForm.vagas}
                      onChange={(e) => setEditForm({ ...editForm, vagas: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="50"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Local
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Local do evento"
                    required
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-3 rounded-lg font-semibold transition border border-gray-300"
                    disabled={editLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </span>
                    ) : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
