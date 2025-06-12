// app/redefinir-senha/page.tsx
'use client';
import React, { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod'; 
import Link from 'next/link';

const clientResetPasswordSchema = z.object({
  email: z.string().email({ message: "Formato de e-mail inválido." }),
  codigoRecuperacao: z.string().length(6, { message: "O código de recuperação deve ter 6 dígitos." }),
  novaSenha: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
  confirmarNovaSenha: z.string(),
}).refine(data => data.novaSenha === data.confirmarNovaSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarNovaSenha"],
});

function RedefinirSenhaFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    codigoRecuperacao: '',
    novaSenha: '',
    confirmarNovaSenha: '', 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setFormData(prev => ({ ...prev, email: emailFromUrl }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const validationResult = clientResetPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      let errorMsg = "Por favor, corrija os erros no formulário: ";
      if (errors.email) errorMsg += `Email: ${errors.email.join(', ')}. `;
      if (errors.codigoRecuperacao) errorMsg += `Código: ${errors.codigoRecuperacao.join(', ')}. `;
      if (errors.novaSenha) errorMsg += `Nova Senha: ${errors.novaSenha.join(', ')}. `;
      if (errors.confirmarNovaSenha) errorMsg += `Confirmação: ${errors.confirmarNovaSenha.join(', ')}. `;
      toast.error("Dados inválidos.");
      setFormError(errorMsg.trim());
      return;
    }

    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_URL_API; 
    const apiUrl = `${baseUrl}/auth/reset-password`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          codigoRecuperacao: formData.codigoRecuperacao,
          novaSenha: formData.novaSenha,
          confirmacaoNovaSenha: formData.confirmarNovaSenha,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        if (data?.erro) {
          errorMessage = data.erro;
        } else if (data?.detalhes) {
          const fieldErrors = Object.values(data.detalhes).flat().join(' ');
          if (fieldErrors) errorMessage = fieldErrors;
        }
        throw new Error(errorMessage);
      }

      toast.success(data.message || "Senha redefinida com sucesso!");
      setSuccessMessage(data.message || "Sua senha foi redefinida com sucesso! Você será redirecionado para o login.");
      setFormData({ email: formData.email, codigoRecuperacao: '', novaSenha: '', confirmarNovaSenha: '' });

      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao redefinir senha.";
      toast.error(errorMessage);
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-600 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-300">Redefinir Senha</h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Por favor, informe seu e-mail, o código de 6 dígitos recebido e sua nova senha.
        </p>

        {!successMessage ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
                <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-300 dark:border-red-600">
                    {formError}
                </p>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-mail
              </label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                value={formData.email} onChange={handleChange} disabled={isLoading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="codigoRecuperacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Código de Recuperação
              </label>
              <input
                id="codigoRecuperacao" name="codigoRecuperacao" type="text" autoComplete="one-time-code" required
                value={formData.codigoRecuperacao} onChange={handleChange} disabled={isLoading}
                maxLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 disabled:opacity-50"
                placeholder="Código de 6 dígitos"
              />
            </div>
            <div>
              <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nova Senha
              </label>
              <input
                id="novaSenha" name="novaSenha" type="password" required
                value={formData.novaSenha} onChange={handleChange} disabled={isLoading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                id="confirmarNovaSenha" name="confirmarNovaSenha" type="password" required 
                value={formData.confirmarNovaSenha} onChange={handleChange} disabled={isLoading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 disabled:opacity-50"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                )}
                {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-300 dark:border-green-600">
            {successMessage} <Link href="/login" className="font-bold hover:underline">Ir para Login.</Link>
          </p>
        )}
        <div className="text-sm text-center mt-6">
          <Link href="/login" className="font-medium text-orange-400 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-600 hover:underline">
            Lembrou a senha? Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando dados da página...</div>}>
            <RedefinirSenhaFormContent />
        </Suspense>
    );
}