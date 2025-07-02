"use client";

import React, { useState, useEffect } from "react";
import AdminProtected from "@/components/AdminProtected";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface DashboardStats {
  totalGibis: number;
  totalUsuarios: number;
  totalReviews: number;
  mediaAvaliacao: number;
  gibisPorAno: Array<{ ano: number; quantidade: number }>;
  topGibis: Array<{
    titulo: string;
    mediaAvaliacao: number;
    totalReviews: number;
  }>;
  usuariosAtivos: Array<{ nome: string; totalReviews: number }>;
  avaliacoesPorMes: Array<{ mes: string; quantidade: number }>;
  distribuicaoAvaliacoes: Array<{ estrelas: number; quantidade: number }>;
}

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#fff7ed"];

const DashboardPage: React.FC = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("Token de autenticação não encontrado");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_URL_API;
        const apiUrl = `${baseUrl}/admin/dashboard`;
        console.log("user:", user);
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.warn(
            "API não disponível, usando dados mockados para demonstração"
          );
          return;
        }
        const data: DashboardStats = await response.json();

        setStats(data);
        console.log(data);
      } catch (err: unknown) {
        console.warn("Erro ao conectar com API, usando dados mockados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user]);

  if (isLoading) {
    return (
      <AdminProtected>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </AdminProtected>
    );
  }

  if (error) {
    return (
      <AdminProtected>
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Tentar Novamente
          </button>
        </div>
      </AdminProtected>
    );
  }

  if (!stats) {
    return (
      <AdminProtected>
        <div className="container mx-auto p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum dado disponível
          </p>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Administrativo
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Visão geral das estatísticas da plataforma
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Total de Gibis
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalGibis}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Total de Usuários
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalUsuarios}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Total de Reviews
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalReviews}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Média de Avaliação
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.mediaAvaliacao.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Gibis por Ano */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Gibis Cadastrados por Ano
            </h3>
            <div className="w-full overflow-hidden">
              <ResponsiveContainer width="100%" height={250} minWidth={300}>
                <BarChart data={stats.gibisPorAno}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="ano"
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: '14px',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Bar dataKey="quantidade" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição de Avaliações */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Distribuição de Avaliações
            </h3>
            <div className="w-full overflow-hidden">
              <ResponsiveContainer width="100%" height={250} minWidth={300}>
                <PieChart>
                  <Pie
                    data={stats.distribuicaoAvaliacoes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ estrelas, percent }) =>
                      `${estrelas}★ (${((percent || 0) * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                    fontSize={12}
                  >
                    {stats.distribuicaoAvaliacoes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontSize: '14px',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reviews por Mês */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Reviews por Mês
            </h3>
            <div className="w-full overflow-hidden">
              <ResponsiveContainer width="100%" height={250} minWidth={300}>
                <AreaChart data={stats.avaliacoesPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="mes"
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: '14px',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="quantidade"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Gibis */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Gibis Mais Bem Avaliados
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.topGibis.slice(0, 5).map((gibi, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">
                      {gibi.titulo}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {gibi.totalReviews} reviews
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {gibi.mediaAvaliacao.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usuários Mais Ativos */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Usuários Mais Ativos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Top 10 usuários com mais reviews
            </p>
          </div>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={350} minWidth={300}>
              <BarChart
                data={stats.usuariosAtivos.slice(0, 10)}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  dataKey="nome"
                  type="category"
                  width={80}
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: '14px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Bar dataKey="totalReviews" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
};

export default DashboardPage;
