import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLogs } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page, filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getLogs({ 
        page, 
        limit: 10,
        module: filter !== 'all' ? filter : undefined
      });
      setLogs(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getModuleIcon = (module) => {
    return module === 'category-generator' ? '🏷️' : '📊';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="backdrop-blur-md bg-white/30 rounded-2xl border border-green-200 shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-4 md:mb-0">
            AI Interaction Logs
          </h1>
          
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm"
          >
            <option value="all">All Modules</option>
            <option value="category-generator">Category Generator</option>
            <option value="proposal-generator">Proposal Generator</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="space-y-4">
              {logs.map((log) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedLog(selectedLog?._id === log._id ? null : log)}
                  className={`
                    p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${selectedLog?._id === log._id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-green-200 bg-white/50 hover:border-green-400'
                    }
                  `}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center mb-2 md:mb-0">
                      <span className="text-2xl mr-3">{getModuleIcon(log.module)}</span>
                      <div>
                        <h3 className="font-semibold text-green-700 capitalize">
                          {log.module.replace('-', ' ')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${log.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      `}>
                        {log.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        ⚡ {log.processingTime}ms
                      </span>
                      <span className="text-sm text-gray-600">
                        📊 {log.tokensUsed?.total} tokens
                      </span>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {selectedLog?._id === log._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-green-200"
                      >
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Prompt:</h4>
                            <pre className="p-3 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm">
                              {JSON.stringify(JSON.parse(log.prompt), null, 2)}
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Response:</h4>
                            <pre className="p-3 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm">
                              {typeof log.response === 'string' 
                                ? JSON.stringify(JSON.parse(log.response), null, 2)
                                : JSON.stringify(log.response, null, 2)}
                            </pre>
                          </div>
                          {log.parsedResponse && (
                            <div>
                              <h4 className="font-semibold text-green-700 mb-2">Parsed Data:</h4>
                              <pre className="p-3 bg-green-50 rounded-lg overflow-x-auto text-sm">
                                {JSON.stringify(log.parsedResponse, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-green-200 bg-white/50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-green-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-green-200 bg-white/50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AdminLogs;