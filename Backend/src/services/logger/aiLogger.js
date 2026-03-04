import AILog from '../../models/AILog.js';

export const logAIInteraction = async (logData) => {
  try {
    const aiLog = new AILog({
      module: logData.module,
      prompt: logData.prompt,
      response: logData.response,
      parsedResponse: logData.parsedResponse,
      model: logData.model,
      temperature: logData.temperature,
      tokensUsed: logData.tokensUsed,
      processingTime: logData.processingTime,
      status: 'success',
      metadata: logData.metadata || {}
    });
    
    await aiLog.save();
    return aiLog;
  } catch (error) {
    console.error('Failed to log AI interaction:', error);
    // Don't throw - logging should not break main flow
    return null;
  }
};