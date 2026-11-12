const crypto = require("crypto");
const argon2 = require("argon2");

async function hashPassword(password) {
  return argon2.hash(password, { type: argon2.argon2id });
}

async function verifyPassword(password, hash) {
  if (typeof hash !== "string") return false;

  if (hash.startsWith("$argon2")) {
    return argon2.verify(hash, password);
  }

  const [algorithm, salt, digest, ...extra] = hash.split("$");
  if (algorithm !== "scrypt" || !salt || !digest || extra.length > 0) return false;

  const expected = Buffer.from(digest, "hex");
  if (expected.length !== 64) return false;

  const actual = crypto.scryptSync(password, salt, expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

function needsRehash(hash) {
  return !hash.startsWith("$argon2");
}

module.exports = { hashPassword, verifyPassword, needsRehash };
