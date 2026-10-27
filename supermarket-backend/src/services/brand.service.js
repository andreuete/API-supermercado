const mongoose = require("mongoose");
const brandRepository = require("../repositories/brand.repository");

function validateId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de marca no válido");
    error.statusCode = 400;
    throw error;
  }
}

function validateSlug(slug) {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    const error = new Error("Slug de marca no válido");
    error.statusCode = 400;
    throw error;
  }
}

async function createBrand(data) {
  return brandRepository.create(data);
}

async function getBrands(filter) {
  return brandRepository.findAll(filter);
}

async function getBrandById(id) {
  validateId(id);

  const brand = await brandRepository.findById(id);

  if (!brand) {
    const error = new Error("Marca no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return brand;
}

async function getBrandBySlug(slug) {
  validateSlug(slug);

  const brand = await brandRepository.findBySlug(slug.trim().toLowerCase());

  if (!brand) {
    const error = new Error("Marca no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return brand;
}

async function getActiveBrands() {
  return brandRepository.findActive();
}

async function updateBrand(id, data) {
  validateId(id);

  const brand = await brandRepository.updateById(id, data);

  if (!brand) {
    const error = new Error("Marca no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return brand;
}

async function deleteBrand(id) {
  validateId(id);

  const brand = await brandRepository.deleteById(id);

  if (!brand) {
    const error = new Error("Marca no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return brand;
}

async function softDelete(id) {
  validateId(id);

  const brand = await brandRepository.softDelete(id);

  if (!brand) {
    const error = new Error("Marca no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return brand;
}

async function restoreDeleted(id) {
  validateId(id);

  const brand = await brandRepository.restoreDeleted(id);

  if (!brand) {
    const error = new Error("Marca no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return brand;
}

async function changeStatus(id, status) {
  validateId(id);

  if (!status || typeof status !== "string" || !status.trim()) {
    const error = new Error("El campo status es obligatorio y debe ser un texto");
    error.statusCode = 400;
    throw error;
  }

  const brand = await brandRepository.changeStatus(id, status.trim());

  if (!brand) {
    const error = new Error("Marca no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return brand;
}

async function toggleIsActive(id, isActiveValue) {
  validateId(id);

  let newState = isActiveValue;
  if (typeof newState !== "boolean") {
    const current = await getBrandById(id);
    newState = !current.is_active;
  }

  const brand = await brandRepository.setIsActive(id, newState);

  if (!brand) {
    const error = new Error("Marca no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return brand;
}

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
  getById: getBrandById,
  getBrandBySlug,
  getBySlug: getBrandBySlug,
  getActiveBrands,
  updateBrand,
  deleteBrand,
  softDelete,
  restoreDeleted,
  changeStatus,
  toggleIsActive
};
