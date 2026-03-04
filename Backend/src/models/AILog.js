import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema({
  module: {
    type: String,
    enum: ['category-generator', 'proposal-generator'],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  response: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  parsedResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  model: {
    type: String,
    default: 'gpt-4o-mini'
  },
  temperature: {
    type: Number,
    default: 0.3
  },
  tokensUsed: {
    prompt: Number,
    completion: Number,
    total: Number
  },
  processingTime: Number,
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  },
  error: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AILog = mongoose.model('AILog', aiLogSchema);
export default AILog;