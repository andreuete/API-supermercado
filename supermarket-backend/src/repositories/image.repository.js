const Image = require("../models/image.model");

class ImageRepository {
  async create(data) {
    return Image.create(data);
  }

  async findAll(filter = {}) {
    return Image.find(filter).sort({ created_at: -1, _id: -1 });
  }

  async findById(id) {
    return Image.findById(id);
  }

  async findBySlug(slug) {
    return Image.findOne({ slug });
  }

  async findActive() {
    return Image.find({ is_active: true, deleted_at: null }).sort({ created_at: -1, _id: -1 });
  }

  async findByEntity(entity_type, entity_id) {
    return Image.find({ entity_type, entity_id }).sort({ created_at: -1, _id: -1 });
  }

  async updateById(id, data) {
    return Image.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return Image.findByIdAndDelete(id);
  }

  async softDelete(id) {
    return Image.findByIdAndUpdate(
      id,
      { deleted_at: new Date(), is_active: false },
      { new: true, runValidators: true }
    );
  }

  async restoreDeleted(id) {
    return Image.findByIdAndUpdate(
      id,
      { deleted_at: null, is_active: true },
      { new: true, runValidators: true }
    );
  }

  async changeStatus(id, status) {
    return Image.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async setIsActive(id, is_active) {
    return Image.findByIdAndUpdate(
      id,
      { is_active },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new ImageRepository();
