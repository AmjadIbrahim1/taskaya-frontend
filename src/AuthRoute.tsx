// src/AuthRoute.tsx
import { useState } from 'react';
import { Login } from '@/components/Login';
import { Register } from '@/components/Register';

export function AuthRoute() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <Login onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <Register onSwitchToLogin={() => setIsLogin(true)} />
  );
}