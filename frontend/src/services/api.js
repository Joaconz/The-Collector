const BASE_URL = import.meta.env.VITE_API_URL;

const AUTH_STORAGE_KEY = 'tc_auth';

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details ?? null;
  }
}

export function getStoredAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function request(path, { method = 'GET', body, headers, ...rest } = {}) {
  const auth = getStoredAuth();
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (auth?.token) {
    finalHeaders.Authorization = `Bearer ${auth.token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...rest,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verificá tu conexión e intentá nuevamente.');
  }

  const text = await response.text();
  const json = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredAuth();
    }
    const message = json?.message || 'Ocurrió un error inesperado';
    throw new ApiError(response.status, message, json?.details);
  }

  return json?.data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
