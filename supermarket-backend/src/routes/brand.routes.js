const express = require("express");
const controller = require("../controllers/brand.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { validateMongoId } = require("../middlewares/validateMongoId.middleware");
const { createBrandSchema, updateBrandSchema, changeStatusSchema } = require("../schemas/brand.schema");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Gestión de marcas
 */

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Crear marca
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Hacendado
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Marca creada
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validateBody(createBrandSchema), controller.createBrand);

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Listar marcas
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Lista de marcas
 */
router.get("/", controller.getBrands);

/**
 * @swagger
 * /api/brands/is-active:
 *   get:
 *     summary: Listar marcas activas
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Lista de marcas con is_active=true y no eliminadas
 */
router.get("/is-active", controller.getActiveBrands);
router.get("/isActive", controller.getActiveBrands);
router.get("/active", controller.getActiveBrands);

/**
 * @swagger
 * /api/brands/slug/{slug}:
 *   get:
 *     summary: Obtener marca por slug
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: hacendado
 *     responses:
 *       200:
 *         description: Marca encontrada
 *       400:
 *         description: Slug inválido
 *       404:
 *         description: Marca no encontrada
 */
router.get("/slug/:slug", controller.getBySlug);
router.get("/by-slug/:slug", controller.getBySlug);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Obtener marca por ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marca encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Marca no encontrada
 */
router.get("/:id", validateMongoId, controller.getById);
router.get("/id/:id", validateMongoId, controller.getById);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Actualizar marca
 *     tags: [Brands]
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
 *               name:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Marca actualizada
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Marca no encontrada
 */
router.put("/:id", validateMongoId, validateBody(updateBrandSchema), controller.updateBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Eliminar marca definitivamente (hard delete)
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marca eliminada definitivamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Marca no encontrada
 */
router.delete("/:id", validateMongoId, controller.deleteBrand);

/**
 * @swagger
 * /api/brands/{id}/soft-delete:
 *   patch:
 *     summary: Borrado lógico de marca (softDelete)
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marca marcada como eliminada lógicamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Marca no encontrada
 */
router.patch("/:id/soft-delete", validateMongoId, controller.softDelete);
router.patch("/:id/softDelete", validateMongoId, controller.softDelete);
router.delete("/:id/soft-delete", validateMongoId, controller.softDelete);
router.delete("/:id/soft", validateMongoId, controller.softDelete);

/**
 * @swagger
 * /api/brands/{id}/restore:
 *   patch:
 *     summary: Restaurar marca eliminada lógicamente (restoreDeleted)
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marca restaurada (deleted_at=null, is_active=true)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Marca no encontrada
 */
router.patch("/:id/restore", validateMongoId, controller.restoreDeleted);
router.patch("/:id/restore-deleted", validateMongoId, controller.restoreDeleted);
router.patch("/:id/restoreDeleted", validateMongoId, controller.restoreDeleted);
router.post("/:id/restore", validateMongoId, controller.restoreDeleted);

/**
 * @swagger
 * /api/brands/{id}/status:
 *   patch:
 *     summary: Cambiar estado de la marca (changeStatus)
 *     tags: [Brands]
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
 *         description: Marca no encontrada
 */
router.patch("/:id/status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/change-status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/changeStatus", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.put("/:id/status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);

/**
 * @swagger
 * /api/brands/{id}/is-active:
 *   patch:
 *     summary: Cambiar/alternar estado activo de la marca (isActive)
 *     tags: [Brands]
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
 *         description: Marca no encontrada
 */
router.patch("/:id/is-active", validateMongoId, controller.toggleIsActive);
router.patch("/:id/isActive", validateMongoId, controller.toggleIsActive);
router.patch("/:id/active", validateMongoId, controller.toggleIsActive);
router.get("/:id/is-active", validateMongoId, controller.isActive);
router.get("/:id/isActive", validateMongoId, controller.isActive);

module.exports = router;
