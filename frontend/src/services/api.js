import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const AUTH_STORAGE_KEY = 'tc_auth';

/**
 * Error normalizado para toda la app. Los thunks lo serializan a
 * `{ status, message }` mediante `rejectWithValue`, por lo que los slices
 * y componentes siempre reciben la misma forma de error.
 */
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details ?? null;
  }
}

// ── Persistencia de sesión (JWT) ─────────────────────────────────────────────

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

// ── Instancia de Axios ───────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de request: inyecta el JWT desde localStorage en cada petición.
axiosInstance.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Interceptor de response: desempaqueta el `ApiResponseDTO` del backend
// (`{ status, message, data, timestamp }`) y normaliza los errores a ApiError.
axiosInstance.interceptors.response.use(
  (response) => response.data?.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        clearStoredAuth();
      }
      const message = data?.message || 'Ocurrió un error inesperado';
      return Promise.reject(new ApiError(status, message, data?.details));
    }
    return Promise.reject(
      new ApiError(0, 'No se pudo conectar con el servidor. Verificá tu conexión e intentá nuevamente.')
    );
  }
);

/**
 * Cliente HTTP único de la app. Todas las peticiones pasan por Axios.
 * Cada método devuelve directamente el `data` ya desempaquetado.
 */
export const api = {
  get: (path, config) => axiosInstance.get(path, config),
  post: (path, body, config) => axiosInstance.post(path, body, config),
  put: (path, body, config) => axiosInstance.put(path, body, config),
  patch: (path, body, config) => axiosInstance.patch(path, body, config),
  del: (path, config) => axiosInstance.delete(path, config),
};

export default api;
