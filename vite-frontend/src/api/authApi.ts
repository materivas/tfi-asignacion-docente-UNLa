import axios from 'axios';

const API_URL = '/api/auth';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  username?: string;
  nombre?: string;
  token?: string;
}

export const authApi = {
  // Login de usuario
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    return response.data;
  },

  // Test de conexión
  test: async (): Promise<string> => {
    const response = await axios.get<string>(`${API_URL}/test`);
    return response.data;
  }
};
