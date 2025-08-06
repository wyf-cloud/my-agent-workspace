import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PublishModalProps {
  isOpen: boolean;
  status: 'idle' | 'publishing' | 'success' | 'error';
  progress: number;
  onCancel: () => void;
}

export const PublishModal = ({ isOpen, status, progress, onCancel }: PublishModalProps) => {
  const [message, setMessage] = useState('正在准备发布...');
  
  useEffect(() => {
    if (status === 'publishing') {
      const messages = [
        '正在构建项目...',
        '优化资源文件...',
        '检查代码质量...',
        '生成静态文件...',
        '准备部署...'
      ];
      
      // 随机切换状态消息
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setMessage(messages[randomIndex]);
      }, 1500);
      
      return () => clearInterval(interval);
    } else if (status === 'success') {
      setMessage('网站发布成功！');
    } else if (status === 'error') {
      setMessage('发布失败，请稍后重试');
    } else {
      setMessage('正在准备发布...');
    }
  }, [status]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="text-center">
            {status === 'publishing' && (
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-cloud-upload text-blue-600 dark:text-blue-400 text-2xl animate-spin"></i>
              </div>
            )}
            
            {status === 'success' && (
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-check text-green-600 dark:text-green-400 text-2xl"></i>
              </div>
            )}
            
            {status === 'error' && (
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {status === 'publishing' && '正在发布网站'}
              {status === 'success' && '发布成功！'}
              {status === 'error' && '发布失败'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
            
            {status === 'publishing' && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">发布进度</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <p className="flex items-start">
                  <i className="fa-solid fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
                  <span>网站已成功发布到GitHub Pages。您可以在几分钟后访问您的网站。</span>
                </p>
              </div>
            )}
            
            <div className="flex justify-center">
              {status === 'publishing' ? (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  取消发布
                </button>
              ) : status === 'success' ? (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  完成
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {/* 重试逻辑 */}}
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    重试
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};