const mongoose = require("mongoose");
const User = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");

function unauthorized(res) {
  return res.status(401).json({ success: false, message: "Autenticación requerida o token inválido" });
}

async function authenticate(req, res, next) {
  const authorization = req.get("authorization");
  const match = authorization && authorization.match(/^Bearer\s+([^\s]+)$/i);
  if (!match) return unauthorized(res);

  let payload;
  try {
    payload = verifyToken(match[1]);
  } catch (error) {
    if (["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error.name)) {
      return unauthorized(res);
    }
    return next(error);
  }

  if (!payload || typeof payload !== "object" || typeof payload.sub !== "string" ||
      !mongoose.Types.ObjectId.isValid(payload.sub)) {
    return unauthorized(res);
  }

  try {
    const user = await User.findById(payload.sub)
      .populate("role_ids", "name slug permissions is_active deleted_at");
    if (!user || !user.is_active || user.deleted_at) return unauthorized(res);

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { authenticate };
