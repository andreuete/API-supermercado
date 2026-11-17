const express = require("express");
const controller = require("../controllers/auth.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { loginSchema } = require("../schemas/auth.schema");

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT, roles y datos del usuario
 *       401:
 *         description: Credenciales no válidas
 */
router.post("/login", validateBody(loginSchema), controller.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión y revocar el token actual
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: No autenticado o token inválido
 */
router.post("/logout", authenticate, controller.logout);

module.exports = router;
