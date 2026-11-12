const express = require("express");
const controller = require("../controllers/role.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { validateMongoId } = require("../middlewares/validateMongoId.middleware");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { authorizePermissions } = require("../middlewares/authorize.middleware");
const { createRoleSchema, updateRoleSchema, changeStatusSchema } = require("../schemas/role.schema");

const router = express.Router();
const canReadRoles = authorizePermissions("roles:read");
const canWriteRoles = authorizePermissions("roles:write");

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles y permisos
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear rol
 *     tags: [Roles]
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
 *                 example: admin
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [read, write, delete]
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/", canWriteRoles, validateBody(createRoleSchema), controller.createRole);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Listar roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
 */
router.get("/", canReadRoles, controller.getRoles);

/**
 * @swagger
 * /api/roles/is-active:
 *   get:
 *     summary: Listar roles activos
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles con is_active=true y no eliminados
 */
router.get("/is-active", canReadRoles, controller.getActiveRoles);
router.get("/isActive", canReadRoles, controller.getActiveRoles);
router.get("/active", canReadRoles, controller.getActiveRoles);

/**
 * @swagger
 * /api/roles/slug/{slug}:
 *   get:
 *     summary: Obtener rol por slug
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: admin
 *     responses:
 *       200:
 *         description: Rol encontrado
 *       400:
 *         description: Slug inválido
 *       404:
 *         description: Rol no encontrado
 */
router.get("/slug/:slug", canReadRoles, controller.getBySlug);
router.get("/by-slug/:slug", canReadRoles, controller.getBySlug);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Rol no encontrado
 */
router.get("/:id", canReadRoles, validateMongoId, controller.getById);
router.get("/id/:id", canReadRoles, validateMongoId, controller.getById);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar rol
 *     tags: [Roles]
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
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Rol no encontrado
 */
router.put("/:id", canWriteRoles, validateMongoId, validateBody(updateRoleSchema), controller.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar rol (borrado lógico)
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol marcado como eliminado
 *       400:
 *         description: ID inválido
 *       409:
 *         description: No se puede eliminar porque tiene usuarios asociados
 *       404:
 *         description: Rol no encontrado
 */
router.delete("/:id", canWriteRoles, validateMongoId, controller.deleteRole);

/**
 * @swagger
 * /api/roles/{id}/soft-delete:
 *   patch:
 *     summary: Borrado lógico de rol (softDelete)
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol marcado como eliminado lógicamente
 *       400:
 *         description: ID inválido
 *       409:
 *         description: No se puede eliminar porque tiene usuarios asociados
 *       404:
 *         description: Rol no encontrado
 */
router.patch("/:id/soft-delete", canWriteRoles, validateMongoId, controller.softDelete);
router.patch("/:id/softDelete", canWriteRoles, validateMongoId, controller.softDelete);
router.delete("/:id/soft-delete", canWriteRoles, validateMongoId, controller.softDelete);
router.delete("/:id/soft", canWriteRoles, validateMongoId, controller.softDelete);

/**
 * @swagger
 * /api/roles/{id}/restore:
 *   patch:
 *     summary: Restaurar rol eliminado lógicamente (restoreDeleted)
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol restaurado (deleted_at=null, is_active=true)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Rol no encontrado
 */
router.patch("/:id/restore", canWriteRoles, validateMongoId, controller.restoreDeleted);
router.patch("/:id/restore-deleted", canWriteRoles, validateMongoId, controller.restoreDeleted);
router.patch("/:id/restoreDeleted", canWriteRoles, validateMongoId, controller.restoreDeleted);
router.post("/:id/restore", canWriteRoles, validateMongoId, controller.restoreDeleted);

/**
 * @swagger
 * /api/roles/{id}/status:
 *   patch:
 *     summary: Cambiar estado del rol (changeStatus)
 *     tags: [Roles]
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
 *         description: Rol no encontrado
 */
router.patch("/:id/status", canWriteRoles, validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/change-status", canWriteRoles, validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/changeStatus", canWriteRoles, validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.put("/:id/status", canWriteRoles, validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);

/**
 * @swagger
 * /api/roles/{id}/is-active:
 *   patch:
 *     summary: Cambiar/alternar estado activo del rol (isActive)
 *     tags: [Roles]
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
 *         description: Rol no encontrado
 */
router.patch("/:id/is-active", canWriteRoles, validateMongoId, controller.toggleIsActive);
router.patch("/:id/isActive", canWriteRoles, validateMongoId, controller.toggleIsActive);
router.patch("/:id/active", canWriteRoles, validateMongoId, controller.toggleIsActive);
router.get("/:id/is-active", canReadRoles, validateMongoId, controller.isActive);
router.get("/:id/isActive", canReadRoles, validateMongoId, controller.isActive);

module.exports = router;
