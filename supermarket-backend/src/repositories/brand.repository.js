const Brand = require("../models/brand.model");
const { generateSlug } = require("../models/brand.model");

class BrandRepository {
  async create(data) {
    const brandData = { ...data };
    if (!brandData.slug && brandData.name) {
      brandData.slug = generateSlug(brandData.name);
    } else if (brandData.slug) {
      brandData.slug = generateSlug(brandData.slug);
    }
    return Brand.create(brandData);
  }

  async findAll(filter = {}) {
    return Brand.find(filter).sort({ created_at: -1, _id: -1 });
  }

  async findById(id) {
    return Brand.findById(id);
  }

  async findBySlug(slug) {
    return Brand.findOne({ slug });
  }

  async findActive() {
    return Brand.find({ is_active: true, deleted_at: null }).sort({ created_at: -1, _id: -1 });
  }

  async updateById(id, data) {
    const updateData = { ...data };
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    } else if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }
    return Brand.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return Brand.findByIdAndDelete(id);
  }

  async softDelete(id) {
    return Brand.findByIdAndUpdate(
      id,
      { deleted_at: new Date(), is_active: false },
      { new: true, runValidators: true }
    );
  }

  async restoreDeleted(id) {
    return Brand.findByIdAndUpdate(
      id,
      { deleted_at: null, is_active: true },
      { new: true, runValidators: true }
    );
  }

  async changeStatus(id, status) {
    return Brand.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async setIsActive(id, is_active) {
    return Brand.findByIdAndUpdate(
      id,
      { is_active },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new BrandRepository();
