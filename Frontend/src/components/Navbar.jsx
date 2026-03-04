import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/add-product', label: 'Add Product', icon: '➕' },
    { path: '/generate-proposal', label: 'Generate Proposal', icon: '📊' },
    { path: '/admin-logs', label: 'Admin Logs', icon: '📋' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-green-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          <Link to="/" className="mb-4 md:mb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold text-green-700">
                Rayeva AI Systems
              </span>
            </motion.div>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-2 rounded-xl transition-all duration-300
                    backdrop-blur-md border shadow-lg
                    ${location.pathname === item.path
                      ? 'bg-green-600 text-white border-green-700'
                      : 'bg-white/30 text-gray-700 border-green-200 hover:bg-green-500 hover:text-white'
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;