import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Proposals
export const createProposal = async (proposalData) => {
  const response = await api.post('/proposals', proposalData);
  return response.data;
};

export const getProposals = async (params = {}) => {
  const response = await api.get('/proposals', { params });
  return response.data;
};

export const getProposalById = async (id) => {
  const response = await api.get(`/proposals/${id}`);
  return response.data;
};

// Logs
export const getLogs = async (params = {}) => {
  const response = await api.get('/logs', { params });
  return response.data;
};

export const getLogById = async (id) => {
  const response = await api.get(`/logs/${id}`);
  return response.data;
};

export default api;