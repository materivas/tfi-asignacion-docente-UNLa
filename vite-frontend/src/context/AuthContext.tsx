import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/authApi';
// DOC: [EV-27] Importación de la utilidad para procesar el token JWT.
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  username: string | null;
  nombre: string | null;
  // DOC: [EV-27] Se expone el rol en el estado global para consumo de los componentes.
  rol: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    const savedNombre = localStorage.getItem('nombre');

    if (savedToken && savedUsername) {
      try {
        // DOC: [EV-27] Decodificación del payload del token persistido al recargar la página.
        const decoded: any = jwtDecode(savedToken);
        // Corrección de Bug: El JWT inyecta el claim en inglés ("role")
        setRol(decoded.role || 'ROLE_DOCENTE');
        setIsAuthenticated(true);
        setUsername(savedUsername);
        setNombre(savedNombre);
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ username, password });

      if (response.success && response.token) {
        // DOC: [EV-27] Extracción del claim correspondiente al rol directamente del JWT.
        const decoded: any = jwtDecode(response.token);
        // Corrección de Bug: El JWT inyecta el claim en inglés ("role")
        const userRole = decoded.role || 'ROLE_DOCENTE';

        setIsAuthenticated(true);
        setUsername(response.username || username);
        setNombre(response.nombre || username);
        setRol(userRole);

        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username || username);
        localStorage.setItem('nombre', response.nombre || username);

        return { success: true, message: 'Login exitoso' };
      }
      return { success: false, message: response.message || 'Error en login' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setNombre(null);
    setRol(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('nombre');
  };

  return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, username, nombre, rol, isLoading }}>
        {children}
      </AuthContext.Provider>
  );
};