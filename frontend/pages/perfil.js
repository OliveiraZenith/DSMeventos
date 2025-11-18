import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getUserProfile, getUserSubscriptions, updateUserProfile, unsubscribeFromEvent } from '../utils/api';
import { validateTokenOrRedirect } from '../utils/auth';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [createdEventsCount, setCreatedEventsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ nome: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [unsubscribeModal, setUnsubscribeModal] = useState({ show: false, subscriptionId: null, eventTitle: '' });
  const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está logado e se o token é válido
    if (!validateTokenOrRedirect(router)) {
      return;
    }

    // Busca os dados do usuário
    async function fetchUserData() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Busca dados do usuário
        const userData = await getUserProfile(token);
        // Se retornar { success: true, data: {...} }
        if (userData.success && userData.data) {
          setUser(userData.data);
        } else if (userData.nome || userData.name || userData.email) {
          // Se retornar direto o objeto
          setUser(userData);
        }

        // Busca inscrições do usuário
        try {
          const subs = await getUserSubscriptions(token);
          setSubscriptions(subs || []);
        } catch {
          setSubscriptions([]);
        }



        setError('');
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err.message || 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handleEditClick = () => {
    setEditForm({
      nome: user?.nome || user?.name || '',
      email: user?.email || ''
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      const token = localStorage.getItem('token');
      const updatedUser = await updateUserProfile(token, editForm);

      // Atualiza o estado do usuário
      if (updatedUser.success && updatedUser.data) {
        setUser(updatedUser.data);
      } else if (updatedUser.nome || updatedUser.name || updatedUser.email) {
        setUser(updatedUser);
      }

      setShowEditModal(false);
      setError('');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setEditError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setEditLoading(false);
    }
  };

  const handlePasswordClick = () => {
    setPasswordForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');

    // Validação
    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      setPasswordError('As senhas não coincidem');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.novaSenha.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres');
      setPasswordLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await updateUserProfile(token, {
        senhaAtual: passwordForm.senhaAtual,
        senha: passwordForm.novaSenha
      });

      setShowPasswordModal(false);
      setPasswordForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      setError('');
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      setPasswordError(err.message || 'Erro ao alterar senha');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUnsubscribeClick = (eventId, eventTitle) => {
    setUnsubscribeModal({ show: true, subscriptionId: eventId, eventTitle });
  };

  const handleUnsubscribeConfirm = async () => {
    setUnsubscribeLoading(true);

    try {
      const token = localStorage.getItem('token');
      await unsubscribeFromEvent(unsubscribeModal.subscriptionId, token);

      // Remove a inscrição da lista
      setSubscriptions(subscriptions.filter(sub => sub.eventId !== unsubscribeModal.subscriptionId));
      setUnsubscribeModal({ show: false, subscriptionId: null, eventTitle: '' });
      setError('');
    } catch (err) {
      console.error('Erro ao cancelar inscrição:', err);
      setError(err.message || 'Erro ao cancelar inscrição');
      setUnsubscribeModal({ show: false, subscriptionId: null, eventTitle: '' });
    } finally {
      setUnsubscribeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Meu Perfil
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600">Gerencie suas informações e inscrições</p>
        </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {user?.nome || user?.name || 'Usuário'}
                  </h2>
                  <p className="text-gray-600">{user?.email || 'email@exemplo.com'}</p>
                  {user?.createdAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 font-semibold uppercase mb-1">
                      Eventos Criados
                    </p>
                    <p className="text-2xl font-bold text-gray-800">{createdEventsCount}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 font-semibold uppercase mb-1">
                      Inscrições Ativas
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {subscriptions.length}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleEditClick}
                    className="w-full bg-gray-800 text-white hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition"
                  >
                    Editar Perfil
                  </button>
                  <button
                    onClick={handlePasswordClick}
                    className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-3 rounded-lg font-semibold transition"
                  >
                    Alterar Senha
                  </button>
                </div>
              </div>
            </div>

            {/* Subscriptions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Minhas Inscrições
                </h3>

                {subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Nenhuma inscrição ainda
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Você ainda não se inscreveu em nenhum evento.
                    </p>
                    <Link
                      href="/"
                      className="inline-block bg-gray-800 text-white hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition"
                    >
                      Explorar Eventos
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-800 mb-2">
                              {subscription.eventTitle}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date().toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            subscription.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscription.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/evento/${subscription.eventId}`}
                            className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition"
                          >
                            Ver Evento
                          </Link>
                          <button
                            onClick={() => handleUnsubscribeClick(subscription.eventId, subscription.eventTitle)}
                            className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-md text-sm font-semibold transition"
                          >
                            Cancelar Inscrição
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <Link
                  href="/seus-eventos"
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-800 text-white p-3 rounded-lg mr-4 group-hover:scale-110 transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Seus Eventos</h4>
                      <p className="text-sm text-gray-600">Ver eventos criados</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/criar-eventos"
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
                >
                  <div className="flex items-center">
                    <div className="bg-green-600 text-white p-3 rounded-lg mr-4 group-hover:scale-110 transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Criar Evento</h4>
                      <p className="text-sm text-gray-600">Novo evento</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    Nome
                  </label>
                  <input
                    type="text"
                    value={editForm.nome}
                    onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-3 rounded-lg font-semibold transition"
                    disabled={editLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gray-800 text-white hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={editLoading}
                  >
                    {editLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Alterar Senha</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm">{passwordError}</p>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    value={passwordForm.senhaAtual}
                    onChange={(e) => setPasswordForm({ ...passwordForm, senhaAtual: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Digite sua senha atual"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={passwordForm.novaSenha}
                    onChange={(e) => setPasswordForm({ ...passwordForm, novaSenha: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Digite a nova senha"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmarSenha}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmarSenha: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Confirme a nova senha"
                    required
                    minLength={6}
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-3 rounded-lg font-semibold transition"
                    disabled={passwordLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gray-800 text-white hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Unsubscribe Confirmation Modal */}
      {unsubscribeModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Cancelar Inscrição?
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Tem certeza que deseja cancelar sua inscrição no evento <strong>{unsubscribeModal.eventTitle}</strong>?
              </p>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setUnsubscribeModal({ show: false, subscriptionId: null, eventTitle: '' })}
                  className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-3 rounded-lg font-semibold transition"
                  disabled={unsubscribeLoading}
                >
                  Não, Manter
                </button>
                <button
                  onClick={handleUnsubscribeConfirm}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={unsubscribeLoading}
                >
                  {unsubscribeLoading ? 'Cancelando...' : 'Sim, Cancelar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
