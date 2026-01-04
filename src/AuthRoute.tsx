// src/AuthRoute.tsx - FIXED
import { useState } from 'react';
import { Login } from '@/components/Login';
import { Register } from '@/components/Register';
import { useNavigate } from 'react-router-dom';

export function AuthRoute() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return isLogin ? (
    <Login 
      onSwitchToRegister={() => setIsLogin(false)}
      onBack={() => navigate('/')}
    />
  ) : (
    <Register 
      onSwitchToLogin={() => setIsLogin(true)}
      onBack={() => navigate('/')}
    />
  );
}