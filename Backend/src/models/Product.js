import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  tags: [{
    type: String
  }],
  sustainabilityFilters: [{
    type: String
  }],
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'piece'
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  aiMetadata: {
    model: String,
    temperature: Number,
    prompt: String,
    response: mongoose.Schema.Types.Mixed,
    logId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AILog'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

const Product = mongoose.model('Product', productSchema);
export default Product;