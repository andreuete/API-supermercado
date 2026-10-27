const Category = require("../models/category.model");
const { generateSlug } = require("../models/category.model");

class CategoryRepository {
  async create(data) {
    const categoryData = { ...data };
    if (!categoryData.slug && categoryData.name) {
      categoryData.slug = generateSlug(categoryData.name);
    } else if (categoryData.slug) {
      categoryData.slug = generateSlug(categoryData.slug);
    }
    return Category.create(categoryData);
  }

  async findAll(filter = {}) {
    return Category.find(filter)
      .populate("parent_id", "name slug")
      .sort({ created_at: -1, _id: -1 });
  }

  async findById(id) {
    return Category.findById(id).populate("parent_id", "name slug");
  }

  async findBySlug(slug) {
    return Category.findOne({ slug }).populate("parent_id", "name slug");
  }

  async findActive() {
    return Category.find({ is_active: true, deleted_at: null })
      .populate("parent_id", "name slug")
      .sort({ created_at: -1, _id: -1 });
  }

  async updateById(id, data) {
    const updateData = { ...data };
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    } else if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }
    return Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("parent_id", "name slug");
  }

  async deleteById(id) {
    return Category.findByIdAndDelete(id);
  }

  async softDelete(id) {
    return Category.findByIdAndUpdate(
      id,
      { deleted_at: new Date(), is_active: false },
      { new: true, runValidators: true }
    );
  }

  async restoreDeleted(id) {
    return Category.findByIdAndUpdate(
      id,
      { deleted_at: null, is_active: true },
      { new: true, runValidators: true }
    );
  }

  async changeStatus(id, status) {
    return Category.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async setIsActive(id, is_active) {
    return Category.findByIdAndUpdate(
      id,
      { is_active },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new CategoryRepository();
