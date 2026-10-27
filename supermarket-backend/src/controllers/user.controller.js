const userService = require("../services/user.service");

async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function getUserBySlug(req, res, next) {
  try {
    const user = await userService.getUserBySlug(req.params.slug);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function getActiveUsers(req, res, next) {
  try {
    const users = await userService.getActiveUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: "Usuario eliminado correctamente",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

async function softDelete(req, res, next) {
  try {
    const user = await userService.softDelete(req.params.id);
    res.json({
      success: true,
      message: "Usuario eliminado lógicamente (soft delete)",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

async function restoreDeleted(req, res, next) {
  try {
    const user = await userService.restoreDeleted(req.params.id);
    res.json({
      success: true,
      message: "Usuario restaurado correctamente",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;
    const user = await userService.changeStatus(req.params.id, status);
    res.json({
      success: true,
      message: "Estado del usuario actualizado correctamente",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

async function toggleIsActive(req, res, next) {
  try {
    const { isActive } = req.body;
    const user = await userService.toggleIsActive(req.params.id, isActive);
    res.json({
      success: true,
      message: "Estado activo/inactivo actualizado correctamente",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

async function isActive(req, res, next) {
  if (req.params.id) {
    if (req.method === "GET") {
      try {
        const user = await userService.getUserById(req.params.id);
        return res.json({ success: true, isActive: user.is_active, data: user });
      } catch (error) {
        return next(error);
      }
    }
    return toggleIsActive(req, res, next);
  }
  return getActiveUsers(req, res, next);
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getById: getUserById,
  getUserBySlug,
  getBySlug: getUserBySlug,
  getActiveUsers,
  updateUser,
  deleteUser,
  softDelete,
  restoreDeleted,
  changeStatus,
  toggleIsActive,
  isActive
};
