const mongoose = require("mongoose");
const productRepository = require("../repositories/product.repository");

function validateId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de producto no válido");
    error.statusCode = 400;
    throw error;
  }
}

function validateSlug(slug) {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    const error = new Error("Slug de producto no válido");
    error.statusCode = 400;
    throw error;
  }
}

async function createProduct(data) {
  return productRepository.create(data);
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
  validateSlug(slug);

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

  const product = await productRepository.deleteById(id);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function softDelete(id) {
  validateId(id);

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
    newActiveState = !current.isActive;
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
