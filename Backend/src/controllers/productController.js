import { generateProductCategories } from '../services/business/categoryService.js';
import Product from '../models/Product.js';
import { validateProduct } from '../utils/validators.js';

export const createProduct = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }
    
    // Generate AI categories
    const result = await generateProductCategories(req.body);
    
    res.status(201).json({
      success: true,
      data: result.product,
      aiLogId: result.aiLogId,
      message: 'Product created successfully with AI-generated categories'
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};