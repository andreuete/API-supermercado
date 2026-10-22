const productService = require("../services/product.service");

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await productService.getProducts();
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

async function getActiveProducts(req, res, next) {
  try {
    const products = await productService.getActiveProducts();
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: "Producto eliminado correctamente",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function softDelete(req, res, next) {
  try {
    const product = await productService.softDelete(req.params.id);
    res.json({
      success: true,
      message: "Producto eliminado lógicamente (soft delete)",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function restoreDeleted(req, res, next) {
  try {
    const product = await productService.restoreDeleted(req.params.id);
    res.json({
      success: true,
      message: "Producto restaurado correctamente",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;
    const product = await productService.changeStatus(req.params.id, status);
    res.json({
      success: true,
      message: "Estado del producto actualizado correctamente",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function toggleIsActive(req, res, next) {
  try {
    const { isActive } = req.body;
    const product = await productService.toggleIsActive(req.params.id, isActive);
    res.json({
      success: true,
      message: "Estado activo/inactivo actualizado correctamente",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function isActive(req, res, next) {
  if (req.params.id) {
    if (req.method === "GET") {
      try {
        const product = await productService.getProductById(req.params.id);
        return res.json({ success: true, isActive: product.isActive, data: product });
      } catch (error) {
        return next(error);
      }
    }
    return toggleIsActive(req, res, next);
  }
  return getActiveProducts(req, res, next);
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getById: getProductById,
  getProductBySlug,
  getBySlug: getProductBySlug,
  getActiveProducts,
  updateProduct,
  deleteProduct,
  softDelete,
  restoreDeleted,
  changeStatus,
  toggleIsActive,
  isActive
};
