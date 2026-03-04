import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createProposal } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const GenerateProposal = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await createProposal({
        clientName: data.clientName,
        budget: parseFloat(data.budget)
      });
      
      toast.success('Proposal generated successfully!');
      navigate(`/proposal-result/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="backdrop-blur-md bg-white/30 rounded-2xl border border-green-200 shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
          Generate Sustainable Proposal
        </h1>
        <p className="text-gray-600 mb-6">
          Our AI will create an optimized product mix within your budget
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              {...register('clientName', { 
                required: 'Client name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' }
              })}
              className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              placeholder="e.g., Eco Corp Inc."
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget ($)
            </label>
            <input
              type="number"
              step="100"
              {...register('budget', { 
                required: 'Budget is required',
                min: { value: 100, message: 'Minimum budget is $100' }
              })}
              className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              placeholder="5000"
            />
            {errors.budget && (
              <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
            )}
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
                AI is optimizing...
              </div>
            ) : (
              'Generate Sustainable Proposal'
            )}
          </motion.button>
        </form>
        
        <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
          <h3 className="font-semibold text-green-700 mb-2">How it works:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
              AI analyzes available sustainable products
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
              Optimizes mix to maximize sustainability impact
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
              Ensures total cost stays within your budget
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
              Generates environmental impact summary
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default GenerateProposal;