const profileRepository = require("../repositories/profile.repository");
const userRepository = require("../repositories/user.repository");
const { generateSlug } = require("../utils/slug");

async function getProfile(userId) {
  return profileRepository.findOrCreateForUser(userId);
}

async function updateProfile(userId, data) {
  const userUpdates = {};
  if (data.full_name !== undefined) userUpdates.full_name = data.full_name;
  if (data.email !== undefined) {
    const email = data.email.toLowerCase();
    const [username, domain] = email.split("@");
    userUpdates.email = email;
    userUpdates.slug = generateSlug(`${username}-${domain}`);
  }

  if (Object.keys(userUpdates).length > 0) {
    const user = await userRepository.updateById(userId, userUpdates);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }
  }

  if (data.avatar !== undefined) {
    return profileRepository.updateAvatar(userId, data.avatar);
  }

  return getProfile(userId);
}

module.exports = { getProfile, updateProfile };
