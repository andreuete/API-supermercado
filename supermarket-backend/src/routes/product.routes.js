const express = require("express");
const controller = require("../controllers/product.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { validateMongoId } = require("../middlewares/validateMongoId.middleware");
const { createProductSchema, updateProductSchema, changeStatusSchema } = require("../schemas/product.schema");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validateBody(createProductSchema), controller.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", controller.getProducts);

/**
 * @swagger
 * /api/products/is-active:
 *   get:
 *     summary: Listar productos activos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos con isActive=true y no eliminados
 */
router.get("/is-active", controller.getActiveProducts);
router.get("/isActive", controller.getActiveProducts);
router.get("/active", controller.getActiveProducts);

/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Obtener producto por slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: leche-entera
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       400:
 *         description: Slug inválido
 *       404:
 *         description: Producto no encontrado
 */
router.get("/slug/:slug", controller.getBySlug);
router.get("/by-slug/:slug", controller.getBySlug);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID (getById)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", validateMongoId, controller.getById);
router.get("/id/:id", validateMongoId, controller.getById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", validateMongoId, validateBody(updateProductSchema), controller.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto definitivamente (hard delete)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado definitivamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", validateMongoId, controller.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/soft-delete:
 *   patch:
 *     summary: Borrado lógico de producto (softDelete)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto marcado como eliminado lógicamente (deletedAt establecido e isActive a false)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Producto no encontrado
 */
router.patch("/:id/soft-delete", validateMongoId, controller.softDelete);
router.patch("/:id/softDelete", validateMongoId, controller.softDelete);
router.delete("/:id/soft-delete", validateMongoId, controller.softDelete);
router.delete("/:id/soft", validateMongoId, controller.softDelete);

/**
 * @swagger
 * /api/products/{id}/restore:
 *   patch:
 *     summary: Restaurar producto eliminado lógicamente (restoreDeleted)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto restaurado (deletedAt=null, isActive=true)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Producto no encontrado
 */
router.patch("/:id/restore", validateMongoId, controller.restoreDeleted);
router.patch("/:id/restore-deleted", validateMongoId, controller.restoreDeleted);
router.patch("/:id/restoreDeleted", validateMongoId, controller.restoreDeleted);
router.post("/:id/restore", validateMongoId, controller.restoreDeleted);

/**
 * @swagger
 * /api/products/{id}/status:
 *   patch:
 *     summary: Cambiar estado del producto (changeStatus)
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/ChangeStatusInput'
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: ID o estado inválido
 *       404:
 *         description: Producto no encontrado
 */
router.patch("/:id/status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/change-status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/changeStatus", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.put("/:id/status", validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);

/**
 * @swagger
 * /api/products/{id}/is-active:
 *   patch:
 *     summary: Cambiar/alternar estado activo del producto (isActive)
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/IsActiveInput'
 *     responses:
 *       200:
 *         description: Estado isActive actualizado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Producto no encontrado
 */
router.patch("/:id/is-active", validateMongoId, controller.toggleIsActive);
router.patch("/:id/isActive", validateMongoId, controller.toggleIsActive);
router.patch("/:id/active", validateMongoId, controller.toggleIsActive);
router.get("/:id/is-active", validateMongoId, controller.isActive);
router.get("/:id/isActive", validateMongoId, controller.isActive);

module.exports = router;
