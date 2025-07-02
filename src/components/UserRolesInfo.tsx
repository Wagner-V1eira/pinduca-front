import React from 'react';
import { FaUserShield, FaUserTie, FaUser, FaInfoCircle } from 'react-icons/fa';

const UserRolesInfo: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaInfoCircle className="text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Tipos de Usuário no Sistema
        </h3>
      </div>

      <div className="space-y-4">
        {/* Administrador Principal */}
        <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-3 mb-2">
            <FaUserShield className="text-green-600 dark:text-green-400" />
            <h4 className="font-medium text-green-900 dark:text-green-300">
              Administrador Principal (ADMIN)
            </h4>
          </div>
          <ul className="text-sm text-green-800 dark:text-green-400 space-y-1 ml-6">
            <li>• Acesso completo ao sistema</li>
            <li>• Gerenciar todos os usuários</li>
            <li>• Configurações do sistema</li>
            <li>• Gerenciar gibis e reviews</li>
            <li>• Acesso ao dashboard administrativo</li>
          </ul>
        </div>

        {/* Administrador Auxiliar */}
        <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
          <div className="flex items-center gap-3 mb-2">
            <FaUserTie className="text-orange-600 dark:text-orange-400" />
            <h4 className="font-medium text-orange-900 dark:text-orange-300">
              Administrador Auxiliar (ADMIN_AUX)
            </h4>
          </div>
          <ul className="text-sm text-orange-800 dark:text-orange-400 space-y-1 ml-6">
            <li>• Acesso ao dashboard administrativo</li>
            <li>• Excluir reviews de usuários</li>
            <li>• Moderar conteúdo</li>
            <li className="text-red-600 dark:text-red-400">✗ Gerenciar usuários</li>
            <li className="text-red-600 dark:text-red-400">✗ Configurações do sistema</li>
          </ul>
        </div>

        {/* Usuário Regular */}
        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-3 mb-2">
            <FaUser className="text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-900 dark:text-blue-300">
              Usuário Regular (USER)
            </h4>
          </div>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 ml-6">
            <li>• Cadastrar e gerenciar seus gibis</li>
            <li>• Criar e editar seus reviews</li>
            <li>• Visualizar gibis e reviews de outros usuários</li>
            <li>• Gerenciar perfil pessoal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserRolesInfo;
