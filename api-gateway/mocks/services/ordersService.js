// Mock Orders/Subscription Service
// Provides realistic mock data for subscription/registration endpoints
// This is used when the real Orders Service is not yet configured

module.exports = {
  /**
   * Subscribe user to an event
   * @param {string} userId - The user ID
   * @param {string} eventId - The event ID
   * @returns {object} Mock subscription response
   */
  subscribeToEvent: (userId, eventId) => ({
    success: true,
    message: 'Inscrição realizada com sucesso',
    data: {
      id: `sub-${Date.now()}`,
      userId: userId,
      eventId: eventId,
      status: 'confirmed',
      subscribedAt: new Date().toISOString()
    }
  }),
  
  /**
   * Unsubscribe user from an event
   * @param {string} subscriptionId - The subscription ID
   * @returns {object} Mock response
   */
  unsubscribeFromEvent: (subscriptionId) => ({
    success: true,
    message: 'Inscrição cancelada com sucesso'
  }),
  
  /**
   * Get all user subscriptions
   * @param {string} userId - The user ID
   * @returns {object} Mock subscriptions list
   */
  getUserSubscriptions: (userId) => ({
    success: true,
    data: [
      {
        id: 'sub-1',
        userId: userId,
        eventId: 'event-1',
        eventName: 'Workshop de React',
        eventDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'confirmed',
        subscribedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'sub-2',
        userId: userId,
        eventId: 'event-2',
        eventName: 'Palestra sobre Node.js',
        eventDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: 'confirmed',
        subscribedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  }),
  
  /**
   * Get event attendees
   * @param {string} eventId - The event ID
   * @returns {object} Mock attendees list
   */
  getEventAttendees: (eventId) => ({
    success: true,
    data: [
      {
        id: 'user-1',
        name: 'João Silva',
        email: 'joao@example.com',
        subscribedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'user-2',
        name: 'Maria Santos',
        email: 'maria@example.com',
        subscribedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  })
};
