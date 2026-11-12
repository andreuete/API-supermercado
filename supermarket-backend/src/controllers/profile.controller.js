const profileService = require("../services/profile.service");

async function getProfile(req, res, next) {
  try {
    const profile = await profileService.getProfile(req.user._id);
    return res.json({ success: true, data: profile });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const profile = await profileService.updateProfile(req.user._id, req.body);
    return res.json({ success: true, data: profile });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getProfile, updateProfile };
