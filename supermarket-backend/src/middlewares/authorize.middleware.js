function getRoles(user) {
  return Array.isArray(user?.role_ids)
    ? user.role_ids.filter((role) => role.is_active && !role.deleted_at)
    : [];
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const accepted = allowedRoles.map((role) => role.toLowerCase());
    const hasRole = getRoles(req.user).some((role) =>
      accepted.includes(String(role.name || "").toLowerCase()) ||
      accepted.includes(String(role.slug || "").toLowerCase())
    );

    if (!hasRole) {
      return res.status(403).json({ success: false, message: "No tienes permisos para realizar esta acción" });
    }

    return next();
  };
}

function authorizePermissions(...requiredPermissions) {
  return (req, res, next) => {
    const permissions = getRoles(req.user).flatMap((role) =>
      Array.isArray(role.permissions) ? role.permissions : []
    );
    const allowed = permissions.includes("*") ||
      requiredPermissions.every((permission) => permissions.includes(permission));

    if (!allowed) {
      return res.status(403).json({ success: false, message: "No tienes permisos para realizar esta acción" });
    }

    return next();
  };
}

module.exports = { authorizeRoles, authorizePermissions };
