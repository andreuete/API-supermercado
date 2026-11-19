const express = require("express");
const controller = require("../controllers/profile.controller");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { validateBody } = require("../middlewares/validate.middleware");
const { updateProfileSchema } = require("../schemas/profile.schema");

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil con el avatar y datos públicos del usuario
 *       401:
 *         description: No autenticado
 *   patch:
 *     summary: Actualizar los datos del perfil del usuario autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 minLength: 2
 *               email:
 *                 type: string
 *                 format: email
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       401:
 *         description: No autenticado
 */
router.use(authenticate);
router.get("/", controller.getProfile);
router.patch("/", validateBody(updateProfileSchema), controller.updateProfile);

module.exports = router;
