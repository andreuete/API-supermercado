const mongoose = require("mongoose");
const userRepository = require("../repositories/user.repository");

function validateId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de usuario no válido");
    error.statusCode = 400;
    throw error;
  }
}

function validateSlug(slug) {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    const error = new Error("Slug de usuario no válido");
    error.statusCode = 400;
    throw error;
  }
}

async function createUser(data) {
  // TODO: Hashear la contraseña con bcrypt antes de guardar
  // Ejemplo: data.password = await bcrypt.hash(data.password, 10);
  return userRepository.create(data);
}

async function getUsers(filter) {
  return userRepository.findAll(filter);
}

async function getUserById(id) {
  validateId(id);

  const user = await userRepository.findById(id);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function getUserBySlug(slug) {
  validateSlug(slug);

  const user = await userRepository.findBySlug(slug.trim().toLowerCase());

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function getUserByEmail(email) {
  if (!email || typeof email !== "string" || !email.trim()) {
    const error = new Error("El email es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findByEmail(email.trim().toLowerCase());

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function getActiveUsers() {
  return userRepository.findActive();
}

async function updateUser(id, data) {
  validateId(id);

  const updateData = { ...data };
  // TODO: Si se envía password, hashearla con bcrypt antes de guardar
  // Ejemplo: if (updateData.password) { updateData.password = await bcrypt.hash(updateData.password, 10); }

  const user = await userRepository.updateById(id, updateData);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function deleteUser(id) {
  validateId(id);

  const user = await userRepository.deleteById(id);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function softDelete(id) {
  validateId(id);

  const user = await userRepository.softDelete(id);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function restoreDeleted(id) {
  validateId(id);

  const user = await userRepository.restoreDeleted(id);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function changeStatus(id, status) {
  validateId(id);

  if (!status || typeof status !== "string" || !status.trim()) {
    const error = new Error("El campo status es obligatorio y debe ser un texto");
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.changeStatus(id, status.trim());

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function toggleIsActive(id, isActiveValue) {
  validateId(id);

  let newState = isActiveValue;
  if (typeof newState !== "boolean") {
    const current = await getUserById(id);
    newState = !current.is_active;
  }

  const user = await userRepository.setIsActive(id, newState);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getById: getUserById,
  getUserBySlug,
  getBySlug: getUserBySlug,
  getUserByEmail,
  getActiveUsers,
  updateUser,
  deleteUser,
  softDelete,
  restoreDeleted,
  changeStatus,
  toggleIsActive
};
