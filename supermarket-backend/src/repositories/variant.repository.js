const Product = require("../models/product.model");
const { generateSku } = require("../utils/sku");

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

  async existsBySku(sku, productId, currentSku) {
    const upperSku = sku.trim().toUpperCase();
    const products = await Product.find({ "variants.sku": upperSku }).select("_id variants.sku");

    return products.some((product) => {
      const matchingVariants = product.variants.filter((variant) => variant.sku === upperSku);
      const isCurrentProduct = String(product._id) === String(productId);
      const excludesCurrentVariant = isCurrentProduct && currentSku?.toUpperCase() === upperSku;

      return matchingVariants.length > (excludesCurrentVariant ? 1 : 0);
    });
  }

  async generateSkuForProduct(productId) {
    const product = await Product.findById(productId).select("name category");
    if (!product) return null;

    return generateSku(product.category?.name, product.name);
  }

  // Agrega una variante a un producto
  async addVariant(productId, variantData) {
    const product = await Product.findById(productId).select("name category");
    if (!product) return null;

    const variantWithSku = {
      ...variantData,
      sku: variantData.sku?.trim() || generateSku(product.category?.name, product.name)
    };

    return Product.findByIdAndUpdate(
      productId,
      { $push: { variants: variantWithSku } },
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

  // Mantiene la variante dentro del producto para que pueda restaurarse.
  async removeBySku(productId, sku) {
    return this.softDeleteBySku(productId, sku);
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
