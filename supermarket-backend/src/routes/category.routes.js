const express = require("express");
const controller = require("../controllers/category.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { validateMongoId } = require("../middlewares/validateMongoId.middleware");
const { createCategorySchema, updateCategorySchema, changeStatusSchema } = require("../schemas/category.schema");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de categorías
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear categoría
 *     tags: [Categories]
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
 *                 example: Lácteos
 *               description:
 *                 type: string
 *               parent_id:
 *                 type: string
 *                 description: ObjectId de la categoría padre (subcategorías)
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validateBody(createCategorySchema), controller.createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Listar categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías (con parent_id populado)
 */
router.get("/", controller.getCategories);

/**
 * @swagger
 * /api/categories/is-active:
 *   get:
 *     summary: Listar categorías activas
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías con is_active=true y no eliminadas
 */
router.get("/is-active", controller.getActiveCategories);
router.get("/isActive", controller.getActiveCategories);
router.get("/active", controller.getActiveCategories);

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Obtener categoría por slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: lacteos
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       400:
 *         description: Slug inválido
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/slug/:slug", controller.getBySlug);
router.get("/by-slug/:slug", controller.getBySlug);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/:id", validateMongoId, controller.getById);
router.get("/id/:id", validateMongoId, controller.getById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar categoría
 *     tags: [Categories]
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
 *               description:
 *                 type: string
 *               parent_id:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Categoría no encontrada
 */
router.put("/:id", validateMongoId, validateBody(updateCategorySchema), controller.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar categoría definitivamente (hard delete)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada definitivamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", validateMongoId, controller.deleteCategory);

/**
 * @swagger
 * /api/categories/{id}/soft-delete:
 *   patch:
 *     summary: Borrado lógico de categoría (softDelete)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría marcada como eliminada lógicamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoría no encontrada
 */
router.patch("/:id/soft-delete", validateMongoId, controller.softDelete);
router.patch("/:id/softDelete", validateMongoId, controller.softDelete);
router.delete("/:id/soft-delete", validateMongoId, controller.softDelete);
router.delete("/:id/soft", validateMongoId, controller.softDelete);

/**
 * @swagger
 * /api/categories/{id}/restore:
 *   patch:
 *     summary: Restaurar categoría eliminada lógicamente (restoreDeleted)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría restaurada (deleted_at=null, is_active=true)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoría no encontrada
 */
router.patch("/:id/restore", validateMongoId, controller.restoreDeleted);
router.patch("/:id/restore-deleted", validateMongoId, controller.restoreDeleted);
router.patch("/:id/restoreDeleted", validateMongoId, controller.restoreDeleted);
router.post("/:id/restore", validateMongoId, controller.restoreDeleted);

/**
 * @swagger
 * /api/categories/{id}/status:
 *   patch:
 *     summary: Cambiar estado de la categoría (changeStatus)
 *     tags: [Categories]
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
 *         description: Categoría no encontrada
 */
router.patch("/:id/status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/change-status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/changeStatus", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.put("/:id/status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);

/**
 * @swagger
 * /api/categories/{id}/is-active:
 *   patch:
 *     summary: Cambiar/alternar estado activo de la categoría (isActive)
 *     tags: [Categories]
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
 *         description: Categoría no encontrada
 */
router.patch("/:id/is-active", validateMongoId, controller.toggleIsActive);
router.patch("/:id/isActive", validateMongoId, controller.toggleIsActive);
router.patch("/:id/active", validateMongoId, controller.toggleIsActive);
router.get("/:id/is-active", validateMongoId, controller.isActive);
router.get("/:id/isActive", validateMongoId, controller.isActive);

module.exports = router;
