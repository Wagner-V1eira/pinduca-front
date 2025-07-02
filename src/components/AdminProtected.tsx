'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AdminProtectedProps {
  children: React.ReactNode;
  requireFullAdmin?: boolean; // Se true, exige ADMIN completo. Se false, aceita ADMIN_AUX também
}

const AdminProtected: React.FC<AdminProtectedProps> = ({
  children,
  requireFullAdmin = false
}) => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();

  const isAdmin = user?.role === 'ADMIN';
  const isAdminAux = user?.role === 'ADMIN_AUX';
  const hasAdminAccess = isAdmin || isAdminAux;
  const hasRequiredAccess = requireFullAdmin ? isAdmin : hasAdminAccess;

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        toast.error('Acesso negado. Faça login como administrador para acessar esta página.');
        router.replace('/login');
        return;
      }

      if (!hasRequiredAccess) {
        const message = requireFullAdmin
          ? 'Acesso negado. Esta funcionalidade é restrita a administradores principais.'
          : 'Acesso negado. Esta página é restrita a administradores.';
        toast.error(message);
        router.replace('/');
        return;
      }
    }
  }, [isLoggedIn, user, isLoading, router, hasRequiredAccess, requireFullAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Verificando permissões...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !hasRequiredAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 sm:p-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-400 mb-4">
              Acesso Negado
            </h1>
            <p className="text-red-600 dark:text-red-300 text-sm sm:text-base mb-6">
              {requireFullAdmin
                ? 'Esta funcionalidade é restrita a administradores principais.'
                : 'Esta página é restrita a administradores.'
              }
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtected;
