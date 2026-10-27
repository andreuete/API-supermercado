const imageService = require("../services/image.service");

async function createImage(req, res, next) {
  try {
    const image = await imageService.createImage(req.body);
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
}

async function getImages(req, res, next) {
  try {
    const images = await imageService.getImages();
    res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
}

async function getImageById(req, res, next) {
  try {
    const image = await imageService.getImageById(req.params.id);
    res.json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
}

async function getImageBySlug(req, res, next) {
  try {
    const image = await imageService.getImageBySlug(req.params.slug);
    res.json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
}

async function getActiveImages(req, res, next) {
  try {
    const images = await imageService.getActiveImages();
    res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
}

async function getImagesByEntity(req, res, next) {
  try {
    const { entity_type, entity_id } = req.params;
    const images = await imageService.getImagesByEntity(entity_type, entity_id);
    res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
}

async function updateImage(req, res, next) {
  try {
    const image = await imageService.updateImage(req.params.id, req.body);
    res.json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
}

async function deleteImage(req, res, next) {
  try {
    const image = await imageService.deleteImage(req.params.id);
    res.json({
      success: true,
      message: "Imagen eliminada correctamente",
      data: image
    });
  } catch (error) {
    next(error);
  }
}

async function softDelete(req, res, next) {
  try {
    const image = await imageService.softDelete(req.params.id);
    res.json({
      success: true,
      message: "Imagen eliminada lógicamente (soft delete)",
      data: image
    });
  } catch (error) {
    next(error);
  }
}

async function restoreDeleted(req, res, next) {
  try {
    const image = await imageService.restoreDeleted(req.params.id);
    res.json({
      success: true,
      message: "Imagen restaurada correctamente",
      data: image
    });
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;
    const image = await imageService.changeStatus(req.params.id, status);
    res.json({
      success: true,
      message: "Estado de la imagen actualizado correctamente",
      data: image
    });
  } catch (error) {
    next(error);
  }
}

async function toggleIsActive(req, res, next) {
  try {
    const { isActive } = req.body;
    const image = await imageService.toggleIsActive(req.params.id, isActive);
    res.json({
      success: true,
      message: "Estado activo/inactivo actualizado correctamente",
      data: image
    });
  } catch (error) {
    next(error);
  }
}

async function isActive(req, res, next) {
  if (req.params.id) {
    if (req.method === "GET") {
      try {
        const image = await imageService.getImageById(req.params.id);
        return res.json({ success: true, isActive: image.is_active, data: image });
      } catch (error) {
        return next(error);
      }
    }
    return toggleIsActive(req, res, next);
  }
  return getActiveImages(req, res, next);
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
  toggleIsActive,
  isActive
};
