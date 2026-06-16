import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  username: string | null;
  nombre: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUsername = localStorage.getItem('username');
    const savedNombre = localStorage.getItem('nombre');
    if (savedAuth === 'true' && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
      setNombre(savedNombre);
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ username, password });
      
      if (response.success) {
        setIsAuthenticated(true);
        setUsername(response.username || username);
        setNombre(response.nombre || username);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', response.username || username);
        localStorage.setItem('nombre', response.nombre || username);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Error al intentar login:', error);
      
      // Manejo de errores específicos
      if (error.response) {
        // El servidor respondió con un código de error
        return { 
          success: false, 
          message: error.response.data?.message || 'Error de autenticación' 
        };
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        return { 
          success: false, 
          message: 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.' 
        };
      } else {
        // Algo pasó al configurar la petición
        return { 
          success: false, 
          message: 'Error al procesar la solicitud' 
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setNombre(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('nombre');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username, nombre, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
