// API Client for DSMeventos
// All requests go through the API Gateway
// Make sure NEXT_PUBLIC_API_URL is configured in .env

// Remove trailing slash from API_URL to prevent double slashes
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

// Helper to create headers with authentication
function getAuthHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Helper para mapear dados do backend (PT) para o frontend (EN)
function mapEventFromBackend(event) {
  if (!event) return null;
  
  return {
    id: event._id || event.id,
    title: event.nome || event.title,
    description: event.descricao || event.description,
    date: event.data || event.date,
    location: event.local || event.location,
    vagas: event.vagas || 0
  };
}

// Helper para mapear array de eventos
function mapEventsFromBackend(events) {
  if (!Array.isArray(events)) return [];
  return events.map(mapEventFromBackend);
}

// ============================================
// AUTH 
// ============================================

export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password }) // Backend expects 'senha'
    });

    // Read response body only once
    const text = await res.text();
    
    if (!res.ok) {
      let errorMessage = 'Erro ao fazer login';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch {
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error) {
    if (error.message) throw error;
    throw new Error('Erro ao conectar com o servidor');
  }
}

export async function register(name, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: name, email, senha: password }) // Backend expects 'nome' and 'senha'
    });

    // Read response body only once
    const text = await res.text();
    
    if (!res.ok) {
      let errorMessage = 'Erro ao criar conta';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch {
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error) {
    if (error.message) throw error;
    throw new Error('Erro ao conectar com o servidor');
  }
}

// ============================================
// USER 
// ============================================

export async function getUserProfile(token) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao buscar perfil do usuário');
  }

  return res.json();
}

export async function updateUserProfile(token, data) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao atualizar perfil');
  }

  return res.json();
}

// ============================================
// EVENTS 
// ============================================

export async function getEvents() {
  const res = await fetch(`${API_URL}/events`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao buscar eventos');
  }

  const data = await res.json();
  return mapEventsFromBackend(data);
}

export async function getEventById(eventId) {
  try {
    const res = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const text = await res.text();
    console.log('Resposta da API para evento:', text);

    if (!res.ok) {
      let errorMessage = 'Erro ao buscar evento';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    try {
      const data = JSON.parse(text);
      console.log('Dados parseados:', data);
      return mapEventFromBackend(data);
    } catch {
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error) {
    console.error('Erro em getEventById:', error);
    if (error.message) throw error;
    throw new Error('Erro ao conectar com o servidor');
  }
}

export async function createEvent(title, description, date, location, token, vagas = 50) {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ 
      nome: title,           // Maps title -> nome
      descricao: description, // Maps description -> descricao
      data: date,            // Keeps data
      local: location,       // Maps location -> local
      vagas: vagas           // Adds vagas (default 50)
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao criar evento');
  }

  const data = await res.json();
  return mapEventFromBackend(data);
}



export async function updateEvent(eventId, data, token) {
  
  const mappedData = {};
  if (data.title !== undefined) mappedData.nome = data.title;
  if (data.description !== undefined) mappedData.descricao = data.description;
  if (data.date !== undefined) mappedData.data = data.date;
  if (data.location !== undefined) mappedData.local = data.location;
  if (data.vagas !== undefined) mappedData.vagas = data.vagas;

  const res = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(mappedData)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao atualizar evento');
  }

  const result = await res.json();
  return mapEventFromBackend(result);
}

export async function deleteEvent(eventId, token) {
  const res = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  // DELETE returns 204 No Content on success
  if (res.status === 204) {
    return { success: true, message: 'Evento deletado com sucesso' };
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao deletar evento');
  }

  // If it returns any content
  return res.json();
}




// ============================================
// ORDERS/SUBSCRIPTIONS 
// ============================================

export async function subscribeToEvent(eventId, token) {
  const res = await fetch(`${API_URL}/orders/subscribe`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ eventId })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao se inscrever no evento');
  }

  return res.json();
}

export async function unsubscribeFromEvent(subscriptionId, token) {
  const res = await fetch(`${API_URL}/orders/subscribe/${subscriptionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao cancelar inscrição');
  }

  return res.json();
}

export async function getUserSubscriptions(token) {
  const res = await fetch(`${API_URL}/orders/my-subscriptions`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao buscar suas inscrições');
  }

  return res.json();
}


