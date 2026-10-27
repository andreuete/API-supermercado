const Product = require("../models/product.model");

class VariantRepository {
  // Obtiene todas las variantes de un producto
  async findAll(productId) {
    const product = await Product.findById(productId).select("variants");
    return product ? product.variants : null;
  }

  // Obtiene una variante por SKU dentro de un producto
  async findBySku(productId, sku) {
    const product = await Product.findById(productId).select("variants");
    if (!product) return null;
    return product.variants.find((v) => v.sku === sku.toUpperCase()) || null;
  }

  // Agrega una variante a un producto
  async addVariant(productId, variantData) {
    return Product.findByIdAndUpdate(
      productId,
      { $push: { variants: variantData } },
      { new: true, runValidators: true }
    ).select("variants");
  }

  // Actualiza una variante por SKU
  async updateBySku(productId, sku, data) {
    const upperSku = sku.toUpperCase();
    const updateFields = {};
    for (const [key, value] of Object.entries(data)) {
      updateFields[`variants.$.${key}`] = value;
    }
    return Product.findOneAndUpdate(
      { _id: productId, "variants.sku": upperSku },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("variants");
  }

  // Elimina una variante por SKU (hard delete)
  async removeBySku(productId, sku) {
    const upperSku = sku.toUpperCase();
    return Product.findByIdAndUpdate(
      productId,
      { $pull: { variants: { sku: upperSku } } },
      { new: true }
    ).select("variants");
  }

  // Soft delete de una variante
  async softDeleteBySku(productId, sku) {
    const upperSku = sku.toUpperCase();
    return Product.findOneAndUpdate(
      { _id: productId, "variants.sku": upperSku },
      {
        $set: {
          "variants.$.deleted_at": new Date(),
          "variants.$.is_active": false,
          "variants.$.status": "inactive"
        }
      },
      { new: true }
    ).select("variants");
  }

  // Restaurar variante eliminada
  async restoreBySku(productId, sku) {
    const upperSku = sku.toUpperCase();
    return Product.findOneAndUpdate(
      { _id: productId, "variants.sku": upperSku },
      {
        $set: {
          "variants.$.deleted_at": null,
          "variants.$.is_active": true,
          "variants.$.status": "active"
        }
      },
      { new: true }
    ).select("variants");
  }
}

module.exports = new VariantRepository();
