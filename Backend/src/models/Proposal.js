import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    quantity: Number,
    unitCost: Number,
    totalCost: Number
  }],
  totalCost: {
    type: Number,
    required: true
  },
  budgetRemaining: {
    type: Number,
    required: true
  },
  impactSummary: {
    totalSustainableProducts: Number,
    estimatedCarbonReduction: String,
    sustainabilityScore: Number,
    highlights: [String]
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
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Proposal = mongoose.model('Proposal', proposalSchema);
export default Proposal;