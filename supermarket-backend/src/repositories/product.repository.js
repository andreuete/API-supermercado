const Product = require("../models/product.model");
const { generateSlug } = require("../models/product.model");

class ProductRepository {
  async create(data) {
    const productData = { ...data };
    if (!productData.slug && productData.name) {
      productData.slug = generateSlug(productData.name);
    } else if (productData.slug) {
      productData.slug = generateSlug(productData.slug);
    }
    return Product.create(productData);
  }

  async findAll(filter = {}) {
    return Product.find(filter).sort({ created_at: -1, _id: -1 });
  }

  async findById(id) {
    return Product.findById(id);
  }

  async findBySlug(slug) {
    return Product.findOne({ slug });
  }

  async findActive() {
    return Product.find({ is_active: true, deleted_at: null }).sort({ created_at: -1, _id: -1 });
  }

  async updateById(id, data) {
    const updateData = { ...data };
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    } else if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }

    return Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async softDelete(id) {
    return Product.findByIdAndUpdate(
      id,
      {
        deleted_at: new Date(),
        is_active: false
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
        deleted_at: null,
        is_active: true
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
        status
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  async setIsActive(id, is_active) {
    return Product.findByIdAndUpdate(
      id,
      {
        is_active
      },
      {
        new: true,
        runValidators: true
      }
    );
  }
}

module.exports = new ProductRepository();
