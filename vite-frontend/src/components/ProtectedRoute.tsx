import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, rol, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Validando credenciales...</div>;
  }

  // Si no está logueado, lo patea al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere admin y el usuario es docente, lo patea a sus horarios
  if (requireAdmin && rol !== 'ROLE_ADMIN') {
    return <Navigate to="/mis-horarios" replace />;
  }

  // Si pasa todas las validaciones, renderiza la vista solicitada
  return children;
};