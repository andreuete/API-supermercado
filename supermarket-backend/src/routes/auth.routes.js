const express = require("express");
const controller = require("../controllers/auth.controller");
const { validateBody } = require("../middlewares/validate.middleware");
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
 *         description: Token JWT y datos del usuario
 *       401:
 *         description: Credenciales no válidas
 */
router.post("/login", validateBody(loginSchema), controller.login);

module.exports = router;
