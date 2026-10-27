const mongoose = require("mongoose");
const roleRepository = require("../repositories/role.repository");

function validateId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de rol no válido");
    error.statusCode = 400;
    throw error;
  }
}

function validateSlug(slug) {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    const error = new Error("Slug de rol no válido");
    error.statusCode = 400;
    throw error;
  }
}

async function createRole(data) {
  return roleRepository.create(data);
}

async function getRoles(filter) {
  return roleRepository.findAll(filter);
}

async function getRoleById(id) {
  validateId(id);

  const role = await roleRepository.findById(id);

  if (!role) {
    const error = new Error("Rol no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return role;
}

async function getRoleBySlug(slug) {
  validateSlug(slug);

  const role = await roleRepository.findBySlug(slug.trim().toLowerCase());

  if (!role) {
    const error = new Error("Rol no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return role;
}

async function getActiveRoles() {
  return roleRepository.findActive();
}

async function updateRole(id, data) {
  validateId(id);

  const role = await roleRepository.updateById(id, data);

  if (!role) {
    const error = new Error("Rol no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return role;
}

async function deleteRole(id) {
  validateId(id);

  const role = await roleRepository.deleteById(id);

  if (!role) {
    const error = new Error("Rol no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return role;
}

async function softDelete(id) {
  validateId(id);

  const role = await roleRepository.softDelete(id);

  if (!role) {
    const error = new Error("Rol no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return role;
}

async function restoreDeleted(id) {
  validateId(id);

  const role = await roleRepository.restoreDeleted(id);

  if (!role) {
    const error = new Error("Rol no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return role;
}

async function changeStatus(id, status) {
  validateId(id);

  if (!status || typeof status !== "string" || !status.trim()) {
    const error = new Error("El campo status es obligatorio y debe ser un texto");
    error.statusCode = 400;
    throw error;
  }

  const role = await roleRepository.changeStatus(id, status.trim());

  if (!role) {
    const error = new Error("Rol no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return role;
}

async function toggleIsActive(id, isActiveValue) {
  validateId(id);

  let newState = isActiveValue;
  if (typeof newState !== "boolean") {
    const current = await getRoleById(id);
    newState = !current.is_active;
  }

  const role = await roleRepository.setIsActive(id, newState);

  if (!role) {
    const error = new Error("Rol no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return role;
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
  toggleIsActive
};
