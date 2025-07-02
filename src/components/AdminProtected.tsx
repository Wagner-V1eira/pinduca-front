'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        toast.error('Acesso negado. Faça login como administrador para acessar esta página.');
        router.replace('/login');
        return;
      }
      
      if (user?.role !== 'ADMIN') {
        toast.error('Acesso negado. Esta página é restrita a administradores.');
        router.replace('/');
        return;
      }
    }
  }, [isLoggedIn, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Esta página é restrita a administradores.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtected;
