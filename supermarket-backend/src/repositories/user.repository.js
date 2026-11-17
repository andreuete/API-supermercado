const User = require("../models/user.model");

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findAll(filter = {}) {
    return User.find(filter)
      .populate("role_ids", "name slug permissions")
      .populate("profile")
      .sort({ created_at: -1, _id: -1 });
  }

  async findById(id) {
    return User.findById(id)
      .populate("role_ids", "name slug permissions")
      .populate("profile");
  }

  async findBySlug(slug) {
    return User.findOne({ slug })
      .populate("role_ids", "name slug permissions")
      .populate("profile");
  }

  async findByEmail(email) {
    return User.findOne({ email })
      .populate("role_ids", "name slug permissions")
      .populate("profile");
  }

  async findByEmailForAuth(email) {
    return User.findOne({ email })
      .select("+password")
      .populate("role_ids", "name slug permissions")
      .populate("profile");
  }

  async updatePassword(id, password) {
    return User.findByIdAndUpdate(id, { password }, { runValidators: true });
  }

  async findActive() {
    return User.find({ is_active: true, deleted_at: null })
      .populate("role_ids", "name slug permissions")
      .populate("profile")
      .sort({ created_at: -1, _id: -1 });
  }

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("role_ids", "name slug permissions")
      .populate("profile");
  }

  async softDelete(id) {
    return User.findByIdAndUpdate(
      id,
      { deleted_at: new Date(), is_active: false },
      { new: true, runValidators: true }
    ).populate("profile");
  }

  async restoreDeleted(id) {
    return User.findByIdAndUpdate(
      id,
      { deleted_at: null, is_active: true },
      { new: true, runValidators: true }
    ).populate("profile");
  }

  async changeStatus(id, status) {
    return User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("profile");
  }

  async setIsActive(id, is_active) {
    return User.findByIdAndUpdate(
      id,
      { is_active },
      { new: true, runValidators: true }
    ).populate("profile");
  }
}

module.exports = new UserRepository();
