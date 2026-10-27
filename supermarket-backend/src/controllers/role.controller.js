const roleService = require("../services/role.service");

async function createRole(req, res, next) {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
}

async function getRoles(req, res, next) {
  try {
    const roles = await roleService.getRoles();
    res.json({ success: true, count: roles.length, data: roles });
  } catch (error) {
    next(error);
  }
}

async function getRoleById(req, res, next) {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
}

async function getRoleBySlug(req, res, next) {
  try {
    const role = await roleService.getRoleBySlug(req.params.slug);
    res.json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
}

async function getActiveRoles(req, res, next) {
  try {
    const roles = await roleService.getActiveRoles();
    res.json({ success: true, count: roles.length, data: roles });
  } catch (error) {
    next(error);
  }
}

async function updateRole(req, res, next) {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    res.json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
}

async function deleteRole(req, res, next) {
  try {
    const role = await roleService.deleteRole(req.params.id);
    res.json({
      success: true,
      message: "Rol eliminado correctamente",
      data: role
    });
  } catch (error) {
    next(error);
  }
}

async function softDelete(req, res, next) {
  try {
    const role = await roleService.softDelete(req.params.id);
    res.json({
      success: true,
      message: "Rol eliminado lógicamente (soft delete)",
      data: role
    });
  } catch (error) {
    next(error);
  }
}

async function restoreDeleted(req, res, next) {
  try {
    const role = await roleService.restoreDeleted(req.params.id);
    res.json({
      success: true,
      message: "Rol restaurado correctamente",
      data: role
    });
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;
    const role = await roleService.changeStatus(req.params.id, status);
    res.json({
      success: true,
      message: "Estado del rol actualizado correctamente",
      data: role
    });
  } catch (error) {
    next(error);
  }
}

async function toggleIsActive(req, res, next) {
  try {
    const { isActive } = req.body;
    const role = await roleService.toggleIsActive(req.params.id, isActive);
    res.json({
      success: true,
      message: "Estado activo/inactivo actualizado correctamente",
      data: role
    });
  } catch (error) {
    next(error);
  }
}

async function isActive(req, res, next) {
  if (req.params.id) {
    if (req.method === "GET") {
      try {
        const role = await roleService.getRoleById(req.params.id);
        return res.json({ success: true, isActive: role.is_active, data: role });
      } catch (error) {
        return next(error);
      }
    }
    return toggleIsActive(req, res, next);
  }
  return getActiveRoles(req, res, next);
}

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  getById: getRoleById,
  getRoleBySlug,
  getBySlug: getRoleBySlug,
  getActiveRoles,
  updateRole,
  deleteRole,
  softDelete,
  restoreDeleted,
  changeStatus,
  toggleIsActive,
  isActive
};
