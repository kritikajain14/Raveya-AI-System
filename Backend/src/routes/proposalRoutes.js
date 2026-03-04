import express from 'express';
import { 
  createProposal, 
  getProposals, 
  getProposalById 
} from '../controllers/proposalController.js';

const router = express.Router();

router.post('/', createProposal);
router.get('/', getProposals);
router.get('/:id', getProposalById);

export default router;