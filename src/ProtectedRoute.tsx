// src/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { useAuthStore } from '@/store';
import { AuthRoute } from './AuthRoute';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthRoute />;
  }

  return <>{children}</>;
}