import { UsuarioRelacionado } from "@/types";

export type AdminPermission =
  | "dashboard_access"
  | "delete_reviews"
  | "manage_users"
  | "manage_gibis"
  | "system_settings";

export const hasPermission = (
  user: UsuarioRelacionado | null,
  permission: AdminPermission
): boolean => {
  if (!user) return false;

  const { role } = user;

  if (role === "ADMIN") {
    return true;
  }

  if (role === "ADMIN_AUX") {
    const allowedPermissions: AdminPermission[] = [
      "dashboard_access",
      "delete_reviews",
    ];
    return allowedPermissions.includes(permission);
  }

  return false;
};

export const isAnyAdmin = (user: UsuarioRelacionado | null): boolean => {
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "ADMIN_AUX";
};

export const isFullAdmin = (user: UsuarioRelacionado | null): boolean => {
  if (!user) return false;
  return user.role === "ADMIN";
};


export const isAuxAdmin = (user: UsuarioRelacionado | null): boolean => {
  if (!user) return false;
  return user.role === "ADMIN_AUX";
};


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
