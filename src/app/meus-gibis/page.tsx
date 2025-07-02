"use client";
import React, { useState, useEffect } from "react";
import CardGibi from "@/components/CardGibi";
import InputPesquisa from "@/components/InputPesquisa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaBook, FaPlus, FaSpinner } from "react-icons/fa";

interface Gibi {
  id: number;
  titulo: string;
  ano: number;
  sinopse: string | null;
  capaUrl: string | null;
  autor: string | null;
}

export default function GibisPage() {
  const { user, token } = useAuth();
  const [gibis, setGibis] = useState<Gibi[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  console.log("GibisPage: user", user);

  useEffect(() => {
    if (!user || !token) {
      setIsLoading(false);
      return;
    }

    const buscaDados = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const baseUrl = process.env.NEXT_PUBLIC_URL_API;
        const apiUrl = `${baseUrl}/gibi/usuario/${user?.id}`;
        const response = await fetch(apiUrl, {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Erro ao buscar gibis: ${response.status}`);
        }
        const data: Gibi[] = await response.json();
        setGibis(data);
      } catch (error) {
        console.error("Erro ao buscar gibis:", error);
        setError("Erro ao carregar gibis. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    buscaDados();
  }, [user, token]);

  const gibisFiltrados = gibis.filter((gibi) =>
    gibi.titulo.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handleGibiClick = (id: number) => {
    router.push(`/gibi/${id}`);
  };

  const handleAddGibi = () => {
    router.push("/gibi/novo");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando seus gibis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <FaBook className="text-orange-500" />
              Meus Gibis
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
              {gibis.length > 0
                ? `${gibis.length} ${gibis.length === 1 ? 'gibi encontrado' : 'gibis encontrados'}`
                : 'Nenhum gibi cadastrado ainda'
              }
            </p>
          </div>

          <button
            onClick={handleAddGibi}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <FaPlus className="text-sm" />
            <span>Adicionar Gibi</span>
          </button>
        </div>

        <div className="w-full">
          <InputPesquisa setPesquisa={setPesquisa} />
        </div>
      </div>

      {gibis.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-full p-6 mb-6">
            <FaBook className="text-4xl sm:text-5xl text-gray-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Nenhum gibi encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-sm sm:text-base">
            Comece sua coleção adicionando seu primeiro gibi. Organize e compartilhe suas histórias favoritas!
          </p>
          <button
            onClick={handleAddGibi}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <FaPlus />
            <span>Adicionar Primeiro Gibi</span>
          </button>
        </div>
      ) : gibisFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-full p-6 mb-6">
            <FaBook className="text-4xl sm:text-5xl text-gray-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md text-sm sm:text-base">
            Não encontramos gibis com o termo &ldquo;{pesquisa}&rdquo;. Tente uma busca diferente.
          </p>
          <button
            onClick={() => setPesquisa("")}
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-6">
          {gibisFiltrados.map((gibi) => (
            <CardGibi
              key={gibi.id}
              gibi={gibi}
              onClick={() => handleGibiClick(gibi.id)}
            />
          ))}
        </div>
      )}

      {gibisFiltrados.length > 0 && pesquisa && (
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {gibisFiltrados.length} de {gibis.length} gibis encontrados
          </p>
        </div>
      )}
    </div>
  );
}
