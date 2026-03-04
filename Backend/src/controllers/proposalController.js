import { generateProposal } from '../services/business/proposalService.js';
import Proposal from '../models/Proposal.js';
import { validateProposal } from '../utils/validators.js';

export const createProposal = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateProposal(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }
    
    // Generate AI proposal
    const result = await generateProposal(req.body);
    
    res.status(201).json({
      success: true,
      data: result.proposal,
      aiLogId: result.aiLogId,
      message: 'Proposal generated successfully with AI optimization'
    });
  } catch (error) {
    next(error);
  }
};

export const getProposals = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const proposals = await Proposal.find(query)
      .populate('products.productId', 'name category sustainabilityFilters')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Proposal.countDocuments(query);
    
    res.json({
      success: true,
      data: proposals,
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

export const getProposalById = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('products.productId');
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }
    
    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    next(error);
  }
};