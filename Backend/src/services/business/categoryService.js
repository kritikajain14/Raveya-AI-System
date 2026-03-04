import { callGemini } from '../ai/geminiClient.js';
import { categoryPrompt } from '../ai/promptTemplates.js';
import { logAIInteraction } from '../logger/aiLogger.js';
import Product from '../../models/Product.js';
import AILog from '../../models/AILog.js';

export const generateProductCategories = async (productData) => {
  let aiLog = null;
  
  try {
    // Generate prompt
    const prompt = categoryPrompt(productData);
    
    // Call AI service
    const aiResponse = await callGemini(prompt, 0.3);
    
    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse.content);
    } catch (parseError) {
      throw new Error('Failed to parse AI response as JSON');
    }
    
    // Validate response structure
    if (!parsedResponse.primaryCategory || !parsedResponse.tags) {
      throw new Error('AI response missing required fields');
    }
    
    // Log AI interaction
    aiLog = await logAIInteraction({
      module: 'category-generator',
      prompt,
      response: aiResponse.content,
      parsedResponse,
      model: aiResponse.model,
      temperature: 0.3,
      tokensUsed: aiResponse.tokens,
      processingTime: aiResponse.processingTime,
      metadata: { productName: productData.name }
    });
    
    // Create product with AI-generated data
    const product = new Product({
      name: productData.name,
      description: productData.description,
      basePrice: productData.basePrice,
      unit: productData.unit,
      stockQuantity: productData.stockQuantity || 0,
      category: parsedResponse.primaryCategory,
      subcategory: parsedResponse.subcategory || '',
      tags: parsedResponse.tags || [],
      sustainabilityFilters: parsedResponse.sustainabilityFilters || [],
      aiMetadata: {
        model: aiResponse.model,
        temperature: 0.3,
        prompt,
        response: aiResponse.content,
        logId: aiLog._id
      }
    });
    
    await product.save();
    
    return {
      success: true,
      product,
      aiLogId: aiLog._id
    };
    
  } catch (error) {
    // Log failed interaction if AI was called
    if (aiLog) {
      aiLog.status = 'failed';
      aiLog.error = error.message;
      await aiLog.save();
    }
    
    throw error;
  }
};