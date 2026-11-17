const RevokeToken = require("../models/revoke-token.model");

class RevokeTokenRepository {
  async isRevoked(tokenHash) {
    return Boolean(await RevokeToken.exists({ token_hash: tokenHash }));
  }

  async revoke(tokenHash, expiresAt) {
    return RevokeToken.create({ token_hash: tokenHash, expires_at: expiresAt });
  }
}

module.exports = new RevokeTokenRepository();
