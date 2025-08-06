import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

export const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
               <img src="https://lf-code-agent.coze.cn/obj/x-ai-cn/64236443138/attachment/LOGO_1_20250806083705.jpg" alt="Logo" className="h-8 w-auto mr-2" />
               <span className="font-bold text-xl text-gray-800 dark:text-white">蟹老板的软件屋</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
             <Link 
               to="/" 
               className="border-transparent text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
             >
               首页
             </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  管理后台
                </Link>
                <button
                  onClick={handleLogout}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link 
                to="/admin/login" 
                className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                管理员登录
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">打开主菜单</span>
              <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-lg">
            <Link
              to="/"
              className="bg-blue-50 border-blue-500 text-blue-700 dark:bg-gray-800 dark:border-blue-400 dark:text-blue-400 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  管理后台
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  退出登录
                </button>
              </>
            ) : (
                <Link
                  to="/admin/login"
                  className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 block pl-3 pr-4 py-2 rounded-lg text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  管理员登录
                </Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};