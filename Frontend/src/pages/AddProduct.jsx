import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createProduct } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessAnimation from '../components/SuccessAnimation';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await createProduct({
        name: data.name,
        description: data.description,
        basePrice: parseFloat(data.basePrice),
        unit: data.unit,
        stockQuantity: parseInt(data.stockQuantity) || 0
      });
      
      setAiResponse(response.data);
      setShowSuccess(true);
      toast.success('Product created with AI-generated categories!');
      reset();
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      {showSuccess && (
        <SuccessAnimation 
          message="Product added successfully!" 
          onComplete={() => setShowSuccess(false)}
        />
      )}
      
      <div className="backdrop-blur-md bg-white/30 rounded-2xl border border-green-200 shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
          Add New Product
        </h1>
        <p className="text-gray-600 mb-6">
          Our AI will automatically categorize and generate SEO tags for your product
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              {...register('name', { 
                required: 'Product name is required',
                minLength: { value: 3, message: 'Minimum 3 characters' }
              })}
              className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              placeholder="e.g., Organic Cotton T-shirt"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Minimum 10 characters' }
              })}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              placeholder="Describe your product in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('basePrice', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="29.99"
              />
              {errors.basePrice && (
                <p className="mt-1 text-sm text-red-600">{errors.basePrice.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                {...register('unit')}
                className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              >
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="liter">Liter</option>
                <option value="meter">Meter</option>
                <option value="set">Set</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                {...register('stockQuantity')}
                className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="100"
              />
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-linear-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-6 rounded-xl hover:brightness-110 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing with AI...
              </div>
            ) : (
              'Generate Categories & Tags'
            )}
          </motion.button>
        </form>
        
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200"
          >
            <h3 className="text-lg font-semibold text-green-700 mb-4">
              AI Generated Results
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <span className="ml-2 text-green-600">{aiResponse.category}</span>
              </div>
              {aiResponse.subcategory && (
                <div>
                  <span className="font-medium text-gray-700">Subcategory:</span>
                  <span className="ml-2 text-green-600">{aiResponse.subcategory}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {aiResponse.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Sustainability:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {aiResponse.sustainabilityFilters?.map((filter, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-600 text-white rounded-full text-sm"
                    >
                      🌱 {filter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AddProduct;