import axios from 'axios';

const API_URL = '/api/auth';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  username?: string;
  nombre?: string;
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
