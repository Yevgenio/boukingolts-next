import API_URL from '@/config/config';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // if using cookies
  });

  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Logout failed');
}
