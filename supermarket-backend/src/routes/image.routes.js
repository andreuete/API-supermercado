const express = require("express");
const controller = require("../controllers/image.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { validateMongoId } = require("../middlewares/validateMongoId.middleware");
const { createImageSchema, updateImageSchema, changeStatusSchema } = require("../schemas/image.schema");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Gestión de imágenes (colección polimórfica)
 */

/**
 * @swagger
 * /api/images:
 *   post:
 *     summary: Crear imagen
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - entity_type
 *               - entity_id
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               entity_type:
 *                 type: string
 *                 enum: [product, category, brand]
 *               entity_id:
 *                 type: string
 *                 description: ObjectId de la entidad asociada
 *               alt_text:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Imagen creada
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validateBody(createImageSchema), controller.createImage);

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Listar imágenes
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Lista de imágenes
 */
router.get("/", controller.getImages);

/**
 * @swagger
 * /api/images/is-active:
 *   get:
 *     summary: Listar imágenes activas
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Lista de imágenes con is_active=true y no eliminadas
 */
router.get("/is-active", controller.getActiveImages);
router.get("/isActive", controller.getActiveImages);
router.get("/active", controller.getActiveImages);

/**
 * @swagger
 * /api/images/by-entity/{entity_type}/{entity_id}:
 *   get:
 *     summary: Obtener imágenes por entidad (entity_type + entity_id)
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: entity_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [product, category, brand]
 *         example: product
 *       - in: path
 *         name: entity_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de la entidad
 *     responses:
 *       200:
 *         description: Lista de imágenes de la entidad
 *       400:
 *         description: Parámetros inválidos
 */
router.get("/by-entity/:entity_type/:entity_id", controller.getImagesByEntity);

/**
 * @swagger
 * /api/images/slug/{slug}:
 *   get:
 *     summary: Obtener imagen por slug
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen encontrada
 *       400:
 *         description: Slug inválido
 *       404:
 *         description: Imagen no encontrada
 */
router.get("/slug/:slug", controller.getBySlug);
router.get("/by-slug/:slug", controller.getBySlug);

/**
 * @swagger
 * /api/images/{id}:
 *   get:
 *     summary: Obtener imagen por ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Imagen no encontrada
 */
router.get("/:id", validateMongoId, controller.getById);
router.get("/id/:id", validateMongoId, controller.getById);

/**
 * @swagger
 * /api/images/{id}:
 *   put:
 *     summary: Actualizar imagen
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               alt_text:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Imagen actualizada
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Imagen no encontrada
 */
router.put("/:id", validateMongoId, validateBody(updateImageSchema), controller.updateImage);

/**
 * @swagger
 * /api/images/{id}:
 *   delete:
 *     summary: Eliminar imagen definitivamente (hard delete)
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen eliminada definitivamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Imagen no encontrada
 */
router.delete("/:id", validateMongoId, controller.deleteImage);

/**
 * @swagger
 * /api/images/{id}/soft-delete:
 *   patch:
 *     summary: Borrado lógico de imagen (softDelete)
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen marcada como eliminada lógicamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Imagen no encontrada
 */
router.patch("/:id/soft-delete", validateMongoId, controller.softDelete);
router.patch("/:id/softDelete", validateMongoId, controller.softDelete);
router.delete("/:id/soft-delete", validateMongoId, controller.softDelete);
router.delete("/:id/soft", validateMongoId, controller.softDelete);

/**
 * @swagger
 * /api/images/{id}/restore:
 *   patch:
 *     summary: Restaurar imagen eliminada lógicamente (restoreDeleted)
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen restaurada (deleted_at=null, is_active=true)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Imagen no encontrada
 */
router.patch("/:id/restore", validateMongoId, controller.restoreDeleted);
router.patch("/:id/restore-deleted", validateMongoId, controller.restoreDeleted);
router.patch("/:id/restoreDeleted", validateMongoId, controller.restoreDeleted);
router.post("/:id/restore", validateMongoId, controller.restoreDeleted);

/**
 * @swagger
 * /api/images/{id}/status:
 *   patch:
 *     summary: Cambiar estado de la imagen (changeStatus)
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: published
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: ID o estado inválido
 *       404:
 *         description: Imagen no encontrada
 */
router.patch("/:id/status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/change-status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/changeStatus", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.put("/:id/status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);

/**
 * @swagger
 * /api/images/{id}/is-active:
 *   patch:
 *     summary: Cambiar/alternar estado activo de la imagen (isActive)
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado is_active actualizado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Imagen no encontrada
 */
router.patch("/:id/is-active", validateMongoId, controller.toggleIsActive);
router.patch("/:id/isActive", validateMongoId, controller.toggleIsActive);
router.patch("/:id/active", validateMongoId, controller.toggleIsActive);
router.get("/:id/is-active", validateMongoId, controller.isActive);
router.get("/:id/isActive", validateMongoId, controller.isActive);

module.exports = router;
