const mongoose = require("mongoose");
const productRepository = require("../repositories/product.repository");
const imageService = require("./image.service");
const { generateSlug } = require("../utils/slug");
const { assertNoReferences } = require("../utils/referentialIntegrity");

function validateId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de producto no válido");
    error.statusCode = 400;
    throw error;
  }
}

function validateSlugFormat(slug) {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    const error = new Error("Slug de producto no válido");
    error.statusCode = 400;
    throw error;
  }
}

async function validateSlug(slug, excludeId) {
  validateSlugFormat(slug);

  const existingProduct = await productRepository.findBySlug(generateSlug(slug));
  if (existingProduct && String(existingProduct._id) !== String(excludeId)) {
    const error = new Error("El slug del producto ya existe");
    error.statusCode = 409;
    throw error;
  }
}

async function createProduct(data) {
  await validateSlug(data.slug || data.name);
  const product = await productRepository.create(data);

  if (!product) {
    const error = new Error("No se pudo crear el producto");
    error.statusCode = 400;
    throw error;
  }

  return product;
}

async function getProducts(filter) {
  return productRepository.findAll(filter);
}

async function getProductById(id) {
  validateId(id);

  const product = await productRepository.findById(id);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function getProductBySlug(slug) {
  validateSlugFormat(slug);

  const normalizedSlug = slug.trim().toLowerCase();
  const product = await productRepository.findBySlug(normalizedSlug);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function getActiveProducts() {
  return productRepository.findActive();
}

async function updateProduct(id, data) {
  validateId(id);
  if (data.slug !== undefined || data.name !== undefined) {
    await validateSlug(data.slug || data.name, id);
  }

  const product = await productRepository.updateById(id, data);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function deleteProduct(id) {
  validateId(id);
  await getProductById(id);
  await imageService.softDeleteByEntity("product", id);

  const product = await productRepository.softDelete(id);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function softDelete(id) {
  validateId(id);
  await getProductById(id);
  await imageService.softDeleteByEntity("product", id);

  const product = await productRepository.softDelete(id);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function restoreDeleted(id) {
  validateId(id);

  const product = await productRepository.restoreDeleted(id);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function changeStatus(id, status) {
  validateId(id);

  if (!status || typeof status !== "string" || !status.trim()) {
    const error = new Error("El campo status es obligatorio y debe ser un texto");
    error.statusCode = 400;
    throw error;
  }

  const product = await productRepository.changeStatus(id, status.trim());

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function toggleIsActive(id, isActiveValue) {
  validateId(id);

  let newActiveState = isActiveValue;
  if (typeof newActiveState !== "boolean") {
    const current = await getProductById(id);
    newActiveState = current.is_active !== undefined ? !current.is_active : !current.isActive;
  }

  const product = await productRepository.setIsActive(id, newActiveState);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getById: getProductById,
  getProductBySlug,
  getBySlug: getProductBySlug,
  getActiveProducts,
  isActive: getActiveProducts,
  updateProduct,
  deleteProduct,
  softDelete,
  restoreDeleted,
  changeStatus,
  toggleIsActive
};
