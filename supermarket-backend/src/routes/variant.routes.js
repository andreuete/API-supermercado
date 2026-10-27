const express = require("express");
const controller = require("../controllers/variant.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { createVariantSchema, updateVariantSchema } = require("../schemas/variant.schema");

// mergeParams: true para acceder a :productId del router padre
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Variants
 *   description: Gestión de variantes (subdocumentos embebidos en Product)
 */

/**
 * @swagger
 * /api/products/{productId}/variants:
 *   get:
 *     summary: Listar variantes de un producto
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Lista de variantes del producto
 *       400:
 *         description: ID de producto inválido
 *       404:
 *         description: Producto no encontrado
 */
router.get("/", controller.getVariants);

/**
 * @swagger
 * /api/products/{productId}/variants:
 *   post:
 *     summary: Añadir variante a un producto
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               - sku
 *               - price
 *               - stock
 *             properties:
 *               sku:
 *                 type: string
 *                 example: PROD-001-L
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 9.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *               attributes:
 *                 type: object
 *                 example: { "size": "L", "color": "red" }
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Variante añadida correctamente
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Producto no encontrado
 */
router.post("/", validateBody(createVariantSchema), controller.addVariant);

/**
 * @swagger
 * /api/products/{productId}/variants/{sku}:
 *   get:
 *     summary: Obtener variante por SKU
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         example: PROD-001-L
 *     responses:
 *       200:
 *         description: Variante encontrada
 *       400:
 *         description: ID o SKU inválido
 *       404:
 *         description: Variante no encontrada
 */
router.get("/:sku", controller.getVariantBySku);

/**
 * @swagger
 * /api/products/{productId}/variants/{sku}:
 *   put:
 *     summary: Actualizar variante por SKU
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sku
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
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               attributes:
 *                 type: object
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Variante actualizada correctamente
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Variante o producto no encontrado
 */
router.put("/:sku", validateBody(updateVariantSchema), controller.updateVariant);

/**
 * @swagger
 * /api/products/{productId}/variants/{sku}:
 *   delete:
 *     summary: Eliminar variante definitivamente (hard delete)
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Variante eliminada correctamente
 *       400:
 *         description: ID o SKU inválido
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:sku", controller.removeVariant);

/**
 * @swagger
 * /api/products/{productId}/variants/{sku}/soft-delete:
 *   patch:
 *     summary: Borrado lógico de variante (softDelete)
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Variante marcada como eliminada lógicamente
 *       400:
 *         description: ID o SKU inválido
 *       404:
 *         description: Variante o producto no encontrado
 */
router.patch("/:sku/soft-delete", controller.softDelete);
router.patch("/:sku/softDelete", controller.softDelete);

/**
 * @swagger
 * /api/products/{productId}/variants/{sku}/restore:
 *   patch:
 *     summary: Restaurar variante eliminada lógicamente
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Variante restaurada correctamente
 *       400:
 *         description: ID o SKU inválido
 *       404:
 *         description: Variante o producto no encontrado
 */
router.patch("/:sku/restore", controller.restoreVariant);
router.patch("/:sku/restore-deleted", controller.restoreVariant);

module.exports = router;
