// Use Vite proxy `/api` during development to avoid CORS issues.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchPlans() {
  const res = await fetch(`${API_BASE}/fetch.php`);
  if (!res.ok) throw new Error('Failed to fetch plans');
  return res.json();
}

export async function savePlan(payload) {
  const res = await fetch(`${API_BASE}/insert.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to save plan');
  const data = await res.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'Failed to save plan');
  }
  return data;
}

export async function deletePlan(id) {
  const res = await fetch(`${API_BASE}/delete.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error('Failed to delete plan');
  const data = await res.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'Failed to delete plan');
  }
  return data;
}

export async function deleteAllPlans() {
  const res = await fetch(`${API_BASE}/delete_all.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) throw new Error('Failed to delete all plans');
  const data = await res.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'Failed to delete all plans');
  }
  return data;
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to register');
  return res.json();
}

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to login');
  return res.json();
}

export default { fetchPlans, savePlan, deletePlan, deleteAllPlans, registerUser, loginUser };
