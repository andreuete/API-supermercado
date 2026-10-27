const mongoose = require("mongoose");
const variantRepository = require("../repositories/variant.repository");

function validateProductId(productId) {
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("ID de producto no válido");
    error.statusCode = 400;
    throw error;
  }
}

function validateSku(sku) {
  if (!sku || typeof sku !== "string" || !sku.trim()) {
    const error = new Error("El SKU es obligatorio");
    error.statusCode = 400;
    throw error;
  }
}

async function getVariants(productId) {
  validateProductId(productId);

  const variants = await variantRepository.findAll(productId);

  if (variants === null) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return variants;
}

async function getVariantBySku(productId, sku) {
  validateProductId(productId);
  validateSku(sku);

  const variant = await variantRepository.findBySku(productId, sku);

  if (!variant) {
    const error = new Error("Variante no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return variant;
}

async function addVariant(productId, data) {
  validateProductId(productId);

  const result = await variantRepository.addVariant(productId, data);

  if (!result) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return result;
}

async function updateVariant(productId, sku, data) {
  validateProductId(productId);
  validateSku(sku);

  const result = await variantRepository.updateBySku(productId, sku, data);

  if (!result) {
    const error = new Error("Variante o producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return result;
}

async function removeVariant(productId, sku) {
  validateProductId(productId);
  validateSku(sku);

  const result = await variantRepository.removeBySku(productId, sku);

  if (!result) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return result;
}

async function softDelete(productId, sku) {
  validateProductId(productId);
  validateSku(sku);

  const result = await variantRepository.softDeleteBySku(productId, sku);

  if (!result) {
    const error = new Error("Variante o producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return result;
}

async function restoreVariant(productId, sku) {
  validateProductId(productId);
  validateSku(sku);

  const result = await variantRepository.restoreBySku(productId, sku);

  if (!result) {
    const error = new Error("Variante o producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return result;
}

module.exports = {
  getVariants,
  getVariantBySku,
  addVariant,
  updateVariant,
  removeVariant,
  softDelete,
  restoreVariant
};
