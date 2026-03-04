import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import AddProduct from './pages/AddProduct';
import GenerateProposal from './pages/GenerateProposal';
import ProposalResult from './pages/ProposalResult';
import AdminLogs from './pages/AdminLogs';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AddProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="generate-proposal" element={<GenerateProposal />} />
          <Route path="proposal-result/:id" element={<ProposalResult />} />
          <Route path="admin-logs" element={<AdminLogs />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;