import Joi from 'joi';

export const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(1000),
    basePrice: Joi.number().required().min(0),
    unit: Joi.string().default('piece'),
    stockQuantity: Joi.number().min(0).default(0)
  });
  
  return schema.validate(data);
};

export const validateProposal = (data) => {
  const schema = Joi.object({
    clientName: Joi.string().required().min(2).max(100),
    budget: Joi.number().required().min(1)
  });
  
  return schema.validate(data);
};