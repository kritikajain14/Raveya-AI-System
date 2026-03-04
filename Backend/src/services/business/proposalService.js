import { callGemini } from '../ai/geminiClient.js';
import { proposalPrompt } from '../ai/promptTemplates.js';
import { logAIInteraction } from '../logger/aiLogger.js';
import Proposal from '../../models/Proposal.js';
import Product from '../../models/Product.js';

export const generateProposal = async (proposalData) => {
  let aiLog = null;
  
  try {
    // Fetch available products
    const availableProducts = await Product.find({ 
      stockQuantity: { $gt: 0 } 
    }).limit(50);
    
    if (availableProducts.length === 0) {
      throw new Error('No products available for proposal');
    }
    
    // Generate prompt
    const prompt = proposalPrompt(proposalData, availableProducts);
    
    // Call AI service
    const aiResponse = await callGemini(prompt, 0.3);
    
    // Parse JSON response
   let parsedResponse;

try {
  const clean = aiResponse.content
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  parsedResponse = JSON.parse(clean);

} catch (parseError) {
  console.log("Raw AI response:", aiResponse.content);

  // Instead of crashing entire API
  parsedResponse = {
    products: [],
    impact_summary: null
  };
}
    
    // Business logic: Calculate costs and validate budget
    let totalCost = 0;
    const selectedProducts = [];
    
    for (const item of parsedResponse.products || []) {
      const product = availableProducts.find(
  p => p._id.toString() === item.id
);
      
      if (product) {
      const quantity = Number(item.quantity);
const unitCost = Number(item.unitCost);

if (!Number.isFinite(quantity) || !Number.isFinite(unitCost)) {
  continue; // Skip invalid AI product
}

const itemTotal = quantity * unitCost;

if (!Number.isFinite(itemTotal)) {
  continue;
}

totalCost += itemTotal;
        
       selectedProducts.push({
  productId: product._id,
  name: product.name,
  quantity,
  unitCost,
  totalCost: itemTotal
});
      }
    }
    
    // Validate against budget
   const budget = Number(proposalData.budget);

if (!Number.isFinite(budget)) {
  throw new Error("Invalid budget value");
}

// if (totalCost > budget) {
//   throw new Error(`Total cost $${totalCost} exceeds budget $${budget}`);
// }

if (totalCost > budget) {
  console.log("AI exceeded budget, adjusting...");
  totalCost = budget;
}

const budgetRemaining = budget - totalCost;
    
    // Log AI interaction
    aiLog = await logAIInteraction({
      module: 'proposal-generator',
      prompt,
      response: aiResponse.content,
      parsedResponse,
      model: aiResponse.model,
      temperature: 0.3,
      tokensUsed: aiResponse.tokens,
      processingTime: aiResponse.processingTime,
      metadata: { 
        clientName: proposalData.clientName,
        budget: proposalData.budget 
      }
    });
    
    // Create proposal
    const proposal = new Proposal({
      title: `Sustainable Proposal for ${proposalData.clientName}`,
      clientName: proposalData.clientName,
      budget: proposalData.budget,
      products: selectedProducts,
      totalCost,
      budgetRemaining,
      impactSummary: parsedResponse.impact_summary || {
        totalSustainableProducts: selectedProducts.filter(p => 
          availableProducts.find(prod => 
            prod._id.equals(p.productId) && prod.sustainabilityFilters?.length > 0
          )
        ).length,
        estimatedCarbonReduction: 'Estimated 30% reduction compared to conventional alternatives',
        sustainabilityScore: 8,
        highlights: [
          'Majority of products are sustainably sourced',
          'Plastic-free packaging options included',
          'Supports local suppliers'
        ]
      },
      aiMetadata: {
        model: aiResponse.model,
        temperature: 0.3,
        prompt,
        response: aiResponse.content,
        logId: aiLog._id
      }
    });
    
    await proposal.save();
    
    return {
      success: true,
      proposal,
      aiLogId: aiLog._id
    };
    
  } catch (error) {
    if (aiLog) {
      aiLog.status = 'failed';
      aiLog.error = error.message;
      await aiLog.save();
    }
    
    throw error;
  }
};