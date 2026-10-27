const brandService = require("../services/brand.service");

async function createBrand(req, res, next) {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
}

async function getBrands(req, res, next) {
  try {
    const brands = await brandService.getBrands();
    res.json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    next(error);
  }
}

async function getBrandById(req, res, next) {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
}

async function getBrandBySlug(req, res, next) {
  try {
    const brand = await brandService.getBrandBySlug(req.params.slug);
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
}

async function getActiveBrands(req, res, next) {
  try {
    const brands = await brandService.getActiveBrands();
    res.json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    next(error);
  }
}

async function updateBrand(req, res, next) {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
}

async function deleteBrand(req, res, next) {
  try {
    const brand = await brandService.deleteBrand(req.params.id);
    res.json({
      success: true,
      message: "Marca eliminada correctamente",
      data: brand
    });
  } catch (error) {
    next(error);
  }
}

async function softDelete(req, res, next) {
  try {
    const brand = await brandService.softDelete(req.params.id);
    res.json({
      success: true,
      message: "Marca eliminada lógicamente (soft delete)",
      data: brand
    });
  } catch (error) {
    next(error);
  }
}

async function restoreDeleted(req, res, next) {
  try {
    const brand = await brandService.restoreDeleted(req.params.id);
    res.json({
      success: true,
      message: "Marca restaurada correctamente",
      data: brand
    });
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;
    const brand = await brandService.changeStatus(req.params.id, status);
    res.json({
      success: true,
      message: "Estado de la marca actualizado correctamente",
      data: brand
    });
  } catch (error) {
    next(error);
  }
}

async function toggleIsActive(req, res, next) {
  try {
    const { isActive } = req.body;
    const brand = await brandService.toggleIsActive(req.params.id, isActive);
    res.json({
      success: true,
      message: "Estado activo/inactivo actualizado correctamente",
      data: brand
    });
  } catch (error) {
    next(error);
  }
}

async function isActive(req, res, next) {
  if (req.params.id) {
    if (req.method === "GET") {
      try {
        const brand = await brandService.getBrandById(req.params.id);
        return res.json({ success: true, isActive: brand.is_active, data: brand });
      } catch (error) {
        return next(error);
      }
    }
    return toggleIsActive(req, res, next);
  }
  return getActiveBrands(req, res, next);
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
  toggleIsActive,
  isActive
};
