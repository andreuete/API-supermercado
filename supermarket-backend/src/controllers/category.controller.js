const categoryService = require("../services/category.service");

async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await categoryService.getCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

async function getActiveCategories(req, res, next) {
  try {
    const categories = await categoryService.getActiveCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    res.json({
      success: true,
      message: "Categoría eliminada correctamente",
      data: category
    });
  } catch (error) {
    next(error);
  }
}

async function softDelete(req, res, next) {
  try {
    const category = await categoryService.softDelete(req.params.id);
    res.json({
      success: true,
      message: "Categoría eliminada lógicamente (soft delete)",
      data: category
    });
  } catch (error) {
    next(error);
  }
}

async function restoreDeleted(req, res, next) {
  try {
    const category = await categoryService.restoreDeleted(req.params.id);
    res.json({
      success: true,
      message: "Categoría restaurada correctamente",
      data: category
    });
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;
    const category = await categoryService.changeStatus(req.params.id, status);
    res.json({
      success: true,
      message: "Estado de la categoría actualizado correctamente",
      data: category
    });
  } catch (error) {
    next(error);
  }
}

async function toggleIsActive(req, res, next) {
  try {
    const { isActive } = req.body;
    const category = await categoryService.toggleIsActive(req.params.id, isActive);
    res.json({
      success: true,
      message: "Estado activo/inactivo actualizado correctamente",
      data: category
    });
  } catch (error) {
    next(error);
  }
}

async function isActive(req, res, next) {
  if (req.params.id) {
    if (req.method === "GET") {
      try {
        const category = await categoryService.getCategoryById(req.params.id);
        return res.json({ success: true, isActive: category.is_active, data: category });
      } catch (error) {
        return next(error);
      }
    }
    return toggleIsActive(req, res, next);
  }
  return getActiveCategories(req, res, next);
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
  toggleIsActive,
  isActive
};
