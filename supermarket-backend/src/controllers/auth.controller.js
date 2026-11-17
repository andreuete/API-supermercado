const authService = require("../services/auth.service");

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.authToken, req.authPayload);
    return res.json({ success: true, message: "Sesión cerrada correctamente" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { login, logout };
