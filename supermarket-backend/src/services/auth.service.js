const userRepository = require("../repositories/user.repository");
const revokeTokenRepository = require("../repositories/revoke-token.repository");
const { createToken } = require("../utils/jwt");
const { hashToken } = require("../utils/token-hash");
const { hashPassword, needsRehash, verifyPassword } = require("../utils/password");

function invalidCredentials() {
  const error = new Error("Credenciales no válidas");
  error.statusCode = 401;
  return error;
}

async function login(email, password) {
  const user = await userRepository.findByEmailForAuth(email.trim().toLowerCase());
  if (!user || !user.is_active || user.deleted_at) throw invalidCredentials();

  const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) throw invalidCredentials();

  if (needsRehash(user.password)) {
    await userRepository.updatePassword(user._id, await hashPassword(password));
  }

  return {
    token: createToken({ sub: user._id.toString() }),
    roles: user.role_ids,
    user: user.toJSON()
  };
}

async function logout(token, payload) {
  if (!Number.isFinite(payload.exp)) {
    const error = new Error("El token no contiene una fecha de expiración válida");
    error.statusCode = 400;
    throw error;
  }

  await revokeTokenRepository.revoke(
    hashToken(token),
    new Date(payload.exp * 1000)
  );
}

module.exports = { login, logout };
