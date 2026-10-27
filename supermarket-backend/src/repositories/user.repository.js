const User = require("../models/user.model");

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findAll(filter = {}) {
    return User.find(filter)
      .populate("role_ids", "name slug permissions")
      .sort({ created_at: -1, _id: -1 });
  }

  async findById(id) {
    return User.findById(id).populate("role_ids", "name slug permissions");
  }

  async findBySlug(slug) {
    return User.findOne({ slug }).populate("role_ids", "name slug permissions");
  }

  async findByEmail(email) {
    return User.findOne({ email }).populate("role_ids", "name slug permissions");
  }

  async findActive() {
    return User.find({ is_active: true, deleted_at: null })
      .populate("role_ids", "name slug permissions")
      .sort({ created_at: -1, _id: -1 });
  }

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("role_ids", "name slug permissions");
  }

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  }

  async softDelete(id) {
    return User.findByIdAndUpdate(
      id,
      { deleted_at: new Date(), is_active: false },
      { new: true, runValidators: true }
    );
  }

  async restoreDeleted(id) {
    return User.findByIdAndUpdate(
      id,
      { deleted_at: null, is_active: true },
      { new: true, runValidators: true }
    );
  }

  async changeStatus(id, status) {
    return User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async setIsActive(id, is_active) {
    return User.findByIdAndUpdate(
      id,
      { is_active },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new UserRepository();
