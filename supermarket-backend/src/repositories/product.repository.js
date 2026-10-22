const Product = require("../models/product.model");
const { generateSlug } = require("../models/product.model");

class ProductRepository {
  async create(data) {
    const productData = { ...data };
    if (!productData.slug && productData.nombre) {
      productData.slug = generateSlug(productData.nombre);
    } else if (productData.slug) {
      productData.slug = generateSlug(productData.slug);
    }
    return Product.create(productData);
  }

  async findAll(filter = {}) {
    return Product.find(filter).sort({ createdAt: -1, _id: -1 });
  }

  async findById(id) {
    return Product.findById(id);
  }

  async findBySlug(slug) {
    return Product.findOne({ slug });
  }

  async findActive() {
    return Product.find({ isActive: true, deletedAt: null }).sort({ createdAt: -1, _id: -1 });
  }

  async updateById(id, data) {
    const updateData = { ...data, updatedAt: new Date() };
    if (updateData.nombre && !updateData.slug) {
      updateData.slug = generateSlug(updateData.nombre);
    } else if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }

    return Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteById(id) {
    return Product.findByIdAndDelete(id);
  }

  async softDelete(id) {
    return Product.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
        isActive: false,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  async restoreDeleted(id) {
    return Product.findByIdAndUpdate(
      id,
      {
        deletedAt: null,
        isActive: true,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  async changeStatus(id, status) {
    return Product.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  async setIsActive(id, isActive) {
    return Product.findByIdAndUpdate(
      id,
      {
        isActive,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );
  }
}

module.exports = new ProductRepository();
