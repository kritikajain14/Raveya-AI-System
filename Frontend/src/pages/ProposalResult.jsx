import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getProposalById } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProposalResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      const response = await getProposalById(id);
      setProposal(response.data);
    } catch (error) {
      toast.error('Failed to load proposal');
      navigate('/generate-proposal');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!proposal) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="backdrop-blur-md bg-white/30 rounded-2xl border border-green-200 shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
              {proposal.title}
            </h1>
            <p className="text-gray-600">Client: {proposal.clientName}</p>
          </div>
          <span className={`
            mt-2 md:mt-0 px-4 py-2 rounded-full text-sm font-semibold
            ${proposal.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${proposal.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
            ${proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
            ${proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
          `}>
            {proposal.status.toUpperCase()}
          </span>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-green-700">
              ${proposal.budget.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-green-600">
              ${proposal.totalCost.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Remaining Budget</p>
            <p className="text-2xl font-bold text-green-500">
              ${proposal.budgetRemaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="mb-8 p-6 bg-linear-to-r from-green-600 to-green-700 rounded-xl text-white">
          <h2 className="text-xl font-semibold mb-4">🌍 Environmental Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-green-100 text-sm">Sustainable Products</p>
              <p className="text-2xl font-bold">{proposal.impactSummary.totalSustainableProducts}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Sustainability Score</p>
              <p className="text-2xl font-bold">{proposal.impactSummary.sustainabilityScore}/10</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Carbon Reduction</p>
              <p className="text-lg font-semibold">{proposal.impactSummary.estimatedCarbonReduction}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-green-100 text-sm mb-2">Highlights:</p>
            <ul className="space-y-1">
              {proposal.impactSummary.highlights?.map((highlight, index) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="mr-2">🌱</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Products List */}
        <h2 className="text-xl font-semibold text-green-700 mb-4">Recommended Products</h2>
        <div className="space-y-4">
          {proposal.products.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1 mb-2 md:mb-0">
                  <h3 className="font-semibold text-green-700">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × ${item.unitCost.toFixed(2)}
                  </p>
                </div>
                <div className="text-lg font-bold text-green-600">
                  ${item.totalCost.toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="flex-1 bg-white text-green-600 font-semibold py-3 px-6 rounded-xl border-2 border-green-600 hover:bg-green-50 transition-all duration-300"
          >
            🖨️ Download PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/generate-proposal')}
            className="flex-1 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-xl hover:brightness-110 transition-all duration-300"
          >
            ➕ Generate New Proposal
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalResult;