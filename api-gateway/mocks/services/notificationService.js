// Mock Notification Service
// Provides realistic mock data for notification endpoints
// This is used when the real Notification Service is not yet configured

module.exports = {
  /**
   * Get all notifications for a user
   * @param {string} userId - The user ID
   * @returns {object} Mock notification list
   */
  getNotifications: (userId) => ({
    success: true,
    data: [
      {
        id: 'notif-1',
        userId: userId,
        type: 'event_reminder',
        title: 'Lembrete de Evento',
        message: 'Seu evento "Workshop de React" começa em 1 hora',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        userId: userId,
        type: 'event_update',
        title: 'Atualização de Evento',
        message: 'O evento "Palestra sobre Node.js" teve o horário alterado',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'notif-3',
        userId: userId,
        type: 'subscription_confirmed',
        title: 'Inscrição Confirmada',
        message: 'Sua inscrição para "Seminário de IA" foi confirmada',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ]
  }),
  
  /**
   * Send a new notification
   * @param {object} notificationData - Notification details
   * @returns {object} Mock response with created notification
   */
  sendNotification: (notificationData) => ({
    success: true,
    message: 'Notificação enviada com sucesso',
    data: {
      id: `notif-${Date.now()}`,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    }
  }),
  
  /**
   * Mark a notification as read
   * @param {string} notifId - Notification ID
   * @returns {object} Mock response
   */
  markAsRead: (notifId) => ({
    success: true,
    message: 'Notificação marcada como lida',
    data: {
      id: notifId,
      read: true,
      readAt: new Date().toISOString()
    }
  }),
  
  /**
   * Delete a notification
   * @param {string} notifId - Notification ID
   * @returns {object} Mock response
   */
  deleteNotification: (notifId) => ({
    success: true,
    message: 'Notificação removida com sucesso'
  })
};
