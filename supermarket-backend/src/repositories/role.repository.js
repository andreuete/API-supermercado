const Role = require("../models/role.model");
const { generateSlug } = require("../models/role.model");

class RoleRepository {
  async create(data) {
    const roleData = { ...data };
    if (!roleData.slug && roleData.name) {
      roleData.slug = generateSlug(roleData.name);
    } else if (roleData.slug) {
      roleData.slug = generateSlug(roleData.slug);
    }
    return Role.create(roleData);
  }

  async findAll(filter = {}) {
    return Role.find(filter).sort({ created_at: -1, _id: -1 });
  }

  async findById(id) {
    return Role.findById(id);
  }

  async findBySlug(slug) {
    return Role.findOne({ slug });
  }

  async findActive() {
    return Role.find({ is_active: true, deleted_at: null }).sort({ created_at: -1, _id: -1 });
  }

  async updateById(id, data) {
    const updateData = { ...data };
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    } else if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }
    return Role.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return Role.findByIdAndDelete(id);
  }

  async softDelete(id) {
    return Role.findByIdAndUpdate(
      id,
      { deleted_at: new Date(), is_active: false },
      { new: true, runValidators: true }
    );
  }

  async restoreDeleted(id) {
    return Role.findByIdAndUpdate(
      id,
      { deleted_at: null, is_active: true },
      { new: true, runValidators: true }
    );
  }

  async changeStatus(id, status) {
    return Role.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async setIsActive(id, is_active) {
    return Role.findByIdAndUpdate(
      id,
      { is_active },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new RoleRepository();
