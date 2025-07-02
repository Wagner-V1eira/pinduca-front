"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.png";
import {
  FaHome,
  FaStar,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlusCircle,
  FaChartBar,
  FaBook,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onOpenLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLoginModal }) => {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMinhasAvaliacoesClick = () => {
    if (isLoggedIn) {
      router.push("/minhas-avaliacoes");
    } else {
      onOpenLoginModal();
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-orange-400 dark:bg-gray-600 py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={logo}
              width={40}
              height={40}
              alt="Logo Pinduca"
              className="rounded-full"
              priority
            />
            <Link href="/" className="text-white text-xl font-semibold" onClick={closeMobileMenu}>
              <span className="hidden sm:inline">Pinduca Reviews</span>
              <span className="sm:hidden">Pinduca</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-orange-400 flex items-center space-x-2 transition-colors"
            >
              <FaHome /> <span>Início</span>
            </Link>
            <button
              onClick={handleMinhasAvaliacoesClick}
              className="text-white hover:text-orange-400 flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <FaStar /> <span>Meus Reviews</span>
            </button>
            {isLoggedIn && (user?.role === "ADMIN" || user?.role === "ADMIN_AUX") && (
              <Link
                href="/dashboard"
                className="text-white hover:text-orange-400 flex items-center space-x-2 transition-colors"
              >
                <FaChartBar /> <span>Dashboard</span>
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/meus-gibis"
                className="text-white hover:text-orange-400 flex items-center space-x-2 transition-colors"
              >
                <FaBook /> <span>Meus Gibis</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && user ? (
              <>
                <Link
                  href="/gibi/novo"
                  className="flex items-center text-white hover:text-orange-400 text-sm font-medium transition-colors"
                  title="Adicionar novo gibi"
                >
                  <FaPlusCircle className="mr-1" />
                  <span className="hidden lg:inline">Adicionar Gibi</span>
                </Link>
                <span className="text-white text-sm hidden lg:inline">
                  Olá, {user.nome}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors flex items-center space-x-1"
                  title="Sair"
                >
                  <FaSignOutAlt />
                  <span className="hidden lg:inline">Sair</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenLoginModal}
                  className="text-white hover:text-orange-400 flex items-center space-x-2 transition-colors"
                >
                  <FaSignInAlt /> <span>Entrar</span>
                </button>
                <Link
                  href="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center space-x-2 transition-colors"
                >
                  <FaUserPlus /> <span className="hidden lg:inline">Cadastrar</span>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white hover:text-orange-400 p-2 transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-orange-300 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white hover:text-orange-400 flex items-center space-x-3 py-2 transition-colors"
                onClick={closeMobileMenu}
              >
                <FaHome /> <span>Início</span>
              </Link>
              <button
                onClick={handleMinhasAvaliacoesClick}
                className="text-white hover:text-orange-400 flex items-center space-x-3 py-2 cursor-pointer transition-colors text-left"
              >
                <FaStar /> <span>Meus Reviews</span>
              </button>
              {isLoggedIn && (user?.role === "ADMIN" || user?.role === "ADMIN_AUX") && (
                <Link
                  href="/dashboard"
                  className="text-white hover:text-orange-400 flex items-center space-x-3 py-2 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaChartBar /> <span>Dashboard</span>
                </Link>
              )}
              {isLoggedIn && (
                <Link
                  href="/meus-gibis"
                  className="text-white hover:text-orange-400 flex items-center space-x-3 py-2 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaBook /> <span>Meus Gibis</span>
                </Link>
              )}

              <hr className="border-orange-300" />

              {isLoggedIn && user ? (
                <>
                  <div className="text-white text-sm py-2">
                    Olá, {user.nome}
                  </div>
                  <Link
                    href="/gibi/novo"
                    className="text-white hover:text-orange-400 flex items-center space-x-3 py-2 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <FaPlusCircle /> <span>Adicionar Gibi</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center space-x-3 w-full"
                  >
                    <FaSignOutAlt /> <span>Sair</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onOpenLoginModal();
                      closeMobileMenu();
                    }}
                    className="text-white hover:text-orange-400 flex items-center space-x-3 py-2 transition-colors text-left w-full"
                  >
                    <FaSignInAlt /> <span>Entrar</span>
                  </button>
                  <Link
                    href="/register"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center space-x-3 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <FaUserPlus /> <span>Cadastrar</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
