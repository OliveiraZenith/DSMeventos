export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao conectar com o servidor');
  }

  return res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Erro ao conectar com o servidor');
  }

  return res.json();
}
