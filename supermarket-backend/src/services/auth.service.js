const userRepository = require("../repositories/user.repository");
const { createToken } = require("../utils/jwt");
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
    user: user.toJSON()
  };
}

module.exports = { login };
