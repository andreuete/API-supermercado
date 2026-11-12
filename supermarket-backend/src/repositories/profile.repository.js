const Profile = require("../models/profile.model");

class ProfileRepository {
  async createForUser(userId) {
    return Profile.create({ user_id: userId });
  }

  async findOrCreateForUser(userId) {
    return Profile.findOneAndUpdate(
      { user_id: userId },
      { $setOnInsert: { user_id: userId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate({ path: "user_id", select: "email full_name slug" });
  }

  async updateAvatar(userId, avatar) {
    return Profile.findOneAndUpdate(
      { user_id: userId },
      { $set: { avatar } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate({ path: "user_id", select: "email full_name slug" });
  }
}

module.exports = new ProfileRepository();
