const variantService = require("../services/variant.service");

async function getVariants(req, res, next) {
  try {
    const { productId } = req.params;
    const variants = await variantService.getVariants(productId);
    res.json({ success: true, count: variants.length, data: variants });
  } catch (error) {
    next(error);
  }
}

async function getVariantBySku(req, res, next) {
  try {
    const { productId, sku } = req.params;
    const variant = await variantService.getVariantBySku(productId, sku);
    res.json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
}

async function addVariant(req, res, next) {
  try {
    const { productId } = req.params;
    const result = await variantService.addVariant(productId, req.body);
    res.status(201).json({
      success: true,
      message: "Variante añadida correctamente",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function updateVariant(req, res, next) {
  try {
    const { productId, sku } = req.params;
    const result = await variantService.updateVariant(productId, sku, req.body);
    res.json({
      success: true,
      message: "Variante actualizada correctamente",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function removeVariant(req, res, next) {
  try {
    const { productId, sku } = req.params;
    const result = await variantService.removeVariant(productId, sku);
    res.json({
      success: true,
      message: "Variante eliminada correctamente",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function softDelete(req, res, next) {
  try {
    const { productId, sku } = req.params;
    const result = await variantService.softDelete(productId, sku);
    res.json({
      success: true,
      message: "Variante eliminada lógicamente (soft delete)",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function restoreVariant(req, res, next) {
  try {
    const { productId, sku } = req.params;
    const result = await variantService.restoreVariant(productId, sku);
    res.json({
      success: true,
      message: "Variante restaurada correctamente",
      data: result
    });
  } catch (error) {
    next(error);
  }
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
