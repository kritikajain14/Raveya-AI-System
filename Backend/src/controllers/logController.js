import AILog from '../models/AILog.js';

export const getLogs = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      module: moduleFilter,
      status,
      startDate,
      endDate 
    } = req.query;
    
    const query = {};
    if (moduleFilter) query.module = moduleFilter;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const logs = await AILog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await AILog.countDocuments(query);
    
    res.json({
      success: true,
      data: logs,
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

export const getLogById = async (req, res, next) => {
  try {
    const log = await AILog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Log not found'
      });
    }
    
    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
};