import { UsuarioRelacionado } from "@/types";

export type AdminPermission =
  | "dashboard_access"
  | "delete_reviews"
  | "manage_users"
  | "manage_gibis"
  | "system_settings";

/**
 * Verifica se o usuário tem uma permissão específica
 */
export const hasPermission = (
  user: UsuarioRelacionado | null,
  permission: AdminPermission
): boolean => {
  if (!user) return false;

  const { role } = user;

  // ADMIN tem todas as permissões
  if (role === "ADMIN") {
    return true;
  }

  // ADMIN_AUX tem permissões limitadas
  if (role === "ADMIN_AUX") {
    const allowedPermissions: AdminPermission[] = [
      "dashboard_access",
      "delete_reviews",
    ];
    return allowedPermissions.includes(permission);
  }

  // USER não tem permissões administrativas
  return false;
};

/**
 * Verifica se o usuário é qualquer tipo de administrador
 */
export const isAnyAdmin = (user: UsuarioRelacionado | null): boolean => {
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "ADMIN_AUX";
};

/**
 * Verifica se o usuário é administrador principal
 */
export const isFullAdmin = (user: UsuarioRelacionado | null): boolean => {
  if (!user) return false;
  return user.role === "ADMIN";
};

/**
 * Verifica se o usuário é administrador auxiliar
 */
export const isAuxAdmin = (user: UsuarioRelacionado | null): boolean => {
  if (!user) return false;
  return user.role === "ADMIN_AUX";
};

/**
 * Retorna uma lista de permissões que o usuário possui
 */
export const getUserPermissions = (
  user: UsuarioRelacionado | null
): AdminPermission[] => {
  if (!user) return [];

  const permissions: AdminPermission[] = [];
  const allPermissions: AdminPermission[] = [
    "dashboard_access",
    "delete_reviews",
    "manage_users",
    "manage_gibis",
    "system_settings",
  ];

  allPermissions.forEach((permission) => {
    if (hasPermission(user, permission)) {
      permissions.push(permission);
    }
  });

  return permissions;
};

/**
 * Retorna o nome amigável do tipo de usuário
 */
export const getUserRoleLabel = (user: UsuarioRelacionado | null): string => {
  if (!user) return "Usuário";

  switch (user.role) {
    case "ADMIN":
      return "Administrador Principal";
    case "ADMIN_AUX":
      return "Administrador Auxiliar";
    case "USER":
      return "Usuário";
    default:
      return "Usuário";
  }
};
