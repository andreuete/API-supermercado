const mongoose = require("mongoose");

const revokeTokenSchema = new mongoose.Schema(
  {
    token_hash: {
      type: String,
      required: true,
      unique: true
    },
    expires_at: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    collection: "revoke_tokens",
    versionKey: false
  }
);

module.exports = mongoose.model("RevokeToken", revokeTokenSchema);
