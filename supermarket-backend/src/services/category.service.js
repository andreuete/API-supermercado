const mongoose = require("mongoose");
const categoryRepository = require("../repositories/category.repository");

function validateId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de categoría no válido");
    error.statusCode = 400;
    throw error;
  }
}

function validateSlug(slug) {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    const error = new Error("Slug de categoría no válido");
    error.statusCode = 400;
    throw error;
  }
}

async function createCategory(data) {
  return categoryRepository.create(data);
}

async function getCategories(filter) {
  return categoryRepository.findAll(filter);
}

async function getCategoryById(id) {
  validateId(id);

  const category = await categoryRepository.findById(id);

  if (!category) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function getCategoryBySlug(slug) {
  validateSlug(slug);

  const category = await categoryRepository.findBySlug(slug.trim().toLowerCase());

  if (!category) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function getActiveCategories() {
  return categoryRepository.findActive();
}

async function updateCategory(id, data) {
  validateId(id);

  const category = await categoryRepository.updateById(id, data);

  if (!category) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function deleteCategory(id) {
  validateId(id);

  const category = await categoryRepository.deleteById(id);

  if (!category) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function softDelete(id) {
  validateId(id);

  const category = await categoryRepository.softDelete(id);

  if (!category) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function restoreDeleted(id) {
  validateId(id);

  const category = await categoryRepository.restoreDeleted(id);

  if (!category) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function changeStatus(id, status) {
  validateId(id);

  if (!status || typeof status !== "string" || !status.trim()) {
    const error = new Error("El campo status es obligatorio y debe ser un texto");
    error.statusCode = 400;
    throw error;
  }

  const category = await categoryRepository.changeStatus(id, status.trim());

  if (!category) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function toggleIsActive(id, isActiveValue) {
  validateId(id);

  let newState = isActiveValue;
  if (typeof newState !== "boolean") {
    const current = await getCategoryById(id);
    newState = !current.is_active;
  }

  const category = await categoryRepository.setIsActive(id, newState);

  if (!category) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  getById: getCategoryById,
  getCategoryBySlug,
  getBySlug: getCategoryBySlug,
  getActiveCategories,
  updateCategory,
  deleteCategory,
  softDelete,
  restoreDeleted,
  changeStatus,
  toggleIsActive
};
