const mongoose = require("mongoose");
const imageRepository = require("../repositories/image.repository");

function validateId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de imagen no válido");
    error.statusCode = 400;
    throw error;
  }
}

function validateSlug(slug) {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    const error = new Error("Slug de imagen no válido");
    error.statusCode = 400;
    throw error;
  }
}

async function createImage(data) {
  return imageRepository.create(data);
}

async function getImages(filter) {
  return imageRepository.findAll(filter);
}

async function getImageById(id) {
  validateId(id);

  const image = await imageRepository.findById(id);

  if (!image) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return image;
}

async function getImageBySlug(slug) {
  validateSlug(slug);

  const image = await imageRepository.findBySlug(slug.trim().toLowerCase());

  if (!image) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return image;
}

async function getActiveImages() {
  return imageRepository.findActive();
}

async function getImagesByEntity(entity_type, entity_id) {
  if (!entity_type || typeof entity_type !== "string" || !entity_type.trim()) {
    const error = new Error("El tipo de entidad es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  if (!entity_id || !mongoose.Types.ObjectId.isValid(entity_id)) {
    const error = new Error("El ID de entidad no es válido");
    error.statusCode = 400;
    throw error;
  }

  return imageRepository.findByEntity(entity_type.trim().toLowerCase(), entity_id);
}

async function updateImage(id, data) {
  validateId(id);

  const image = await imageRepository.updateById(id, data);

  if (!image) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return image;
}

async function deleteImage(id) {
  validateId(id);

  const image = await imageRepository.deleteById(id);

  if (!image) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return image;
}

async function softDelete(id) {
  validateId(id);

  const image = await imageRepository.softDelete(id);

  if (!image) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return image;
}

async function restoreDeleted(id) {
  validateId(id);

  const image = await imageRepository.restoreDeleted(id);

  if (!image) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return image;
}

async function changeStatus(id, status) {
  validateId(id);

  if (!status || typeof status !== "string" || !status.trim()) {
    const error = new Error("El campo status es obligatorio y debe ser un texto");
    error.statusCode = 400;
    throw error;
  }

  const image = await imageRepository.changeStatus(id, status.trim());

  if (!image) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return image;
}

async function toggleIsActive(id, isActiveValue) {
  validateId(id);

  let newState = isActiveValue;
  if (typeof newState !== "boolean") {
    const current = await getImageById(id);
    newState = !current.is_active;
  }

  const image = await imageRepository.setIsActive(id, newState);

  if (!image) {
    const error = new Error("Imagen no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return image;
}

module.exports = {
  createImage,
  getImages,
  getImageById,
  getById: getImageById,
  getImageBySlug,
  getBySlug: getImageBySlug,
  getActiveImages,
  getImagesByEntity,
  updateImage,
  deleteImage,
  softDelete,
  restoreDeleted,
  changeStatus,
  toggleIsActive
};
