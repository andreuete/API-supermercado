const express = require("express");
const controller = require("../controllers/user.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { validateMongoId } = require("../middlewares/validateMongoId.middleware");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { authorizePermissions } = require("../middlewares/authorize.middleware");
const { createUserSchema, updateUserSchema, changeStatusSchema } = require("../schemas/user.schema");

const router = express.Router();
const canReadUsers = authorizePermissions("users:read");
const canWriteUsers = authorizePermissions("users:write");

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: secreto123
 *               full_name:
 *                 type: string
 *                 minLength: 2
 *                 example: John Doe
 *               role_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de ObjectIds de roles
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/", canWriteUsers, validateBody(createUserSchema), controller.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios (con role_ids populado, sin password)
 */
router.get("/", canReadUsers, controller.getUsers);

/**
 * @swagger
 * /api/users/is-active:
 *   get:
 *     summary: Listar usuarios activos
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios con is_active=true y no eliminados
 */
router.get("/is-active", canReadUsers, controller.getActiveUsers);
router.get("/isActive", canReadUsers, controller.getActiveUsers);
router.get("/active", canReadUsers, controller.getActiveUsers);

/**
 * @swagger
 * /api/users/slug/{slug}:
 *   get:
 *     summary: Obtener usuario por slug
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       400:
 *         description: Slug inválido
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/slug/:slug", canReadUsers, controller.getBySlug);
router.get("/by-slug/:slug", canReadUsers, controller.getBySlug);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", canReadUsers, validateMongoId, controller.getById);
router.get("/id/:id", canReadUsers, validateMongoId, controller.getById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               role_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               is_active:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", canWriteUsers, validateMongoId, validateBody(updateUserSchema), controller.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario (borrado lógico)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario marcado como eliminado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", canWriteUsers, validateMongoId, controller.deleteUser);

/**
 * @swagger
 * /api/users/{id}/soft-delete:
 *   patch:
 *     summary: Borrado lógico de usuario (softDelete)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario marcado como eliminado lógicamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuario no encontrado
 */
router.patch("/:id/soft-delete", canWriteUsers, validateMongoId, controller.softDelete);
router.patch("/:id/softDelete", canWriteUsers, validateMongoId, controller.softDelete);
router.delete("/:id/soft-delete", canWriteUsers, validateMongoId, controller.softDelete);
router.delete("/:id/soft", canWriteUsers, validateMongoId, controller.softDelete);

/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Restaurar usuario eliminado lógicamente (restoreDeleted)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario restaurado (deleted_at=null, is_active=true)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuario no encontrado
 */
router.patch("/:id/restore", canWriteUsers, validateMongoId, controller.restoreDeleted);
router.patch("/:id/restore-deleted", canWriteUsers, validateMongoId, controller.restoreDeleted);
router.patch("/:id/restoreDeleted", canWriteUsers, validateMongoId, controller.restoreDeleted);
router.post("/:id/restore", canWriteUsers, validateMongoId, controller.restoreDeleted);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Cambiar estado del usuario (changeStatus)
 *     tags: [Users]
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
 *         description: Usuario no encontrado
 */
router.patch("/:id/status", canWriteUsers, validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/change-status", canWriteUsers, validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.patch("/:id/changeStatus", canWriteUsers, validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);
router.put("/:id/status", canWriteUsers, validateMongoId, validateBody(changeStatusSchema), controller.changeStatus);

/**
 * @swagger
 * /api/users/{id}/is-active:
 *   patch:
 *     summary: Cambiar/alternar estado activo del usuario (isActive)
 *     tags: [Users]
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
 *         description: Usuario no encontrado
 */
router.patch("/:id/is-active", canWriteUsers, validateMongoId, controller.toggleIsActive);
router.patch("/:id/isActive", canWriteUsers, validateMongoId, controller.toggleIsActive);
router.patch("/:id/active", canWriteUsers, validateMongoId, controller.toggleIsActive);
router.get("/:id/is-active", canReadUsers, validateMongoId, controller.isActive);
router.get("/:id/isActive", canReadUsers, validateMongoId, controller.isActive);

module.exports = router;
