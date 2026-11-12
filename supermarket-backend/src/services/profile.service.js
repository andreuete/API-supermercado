const profileRepository = require("../repositories/profile.repository");

async function getProfile(userId) {
  return profileRepository.findOrCreateForUser(userId);
}

async function updateProfile(userId, data) {
  return profileRepository.updateAvatar(userId, data.avatar);
}

module.exports = { getProfile, updateProfile };
