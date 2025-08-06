import { useContext, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { Navbar } from './Navbar';
import { toast } from 'sonner';

export const AdminLayout = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 检查是否已登录，如果未登录则重定向到登录页
  // 检查认证状态并处理重定向
  React.useEffect(() => {
    if (!isAuthenticated && location.pathname.startsWith('/admin')) {
      navigate('/admin/login');
      toast.warning('请先登录管理员账户');
    }
  }, [isAuthenticated, location, navigate]);

  // 如果未认证，不渲染内容
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('已成功退出登录');
  };

  // 导航菜单
  const navItems = [
    { path: '/admin/dashboard', label: '仪表盘', icon: 'fa-solid fa-gauge' },
    { path: '/admin/software', label: '软件管理', icon: 'fa-regular fa-file-code' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 移动端侧边栏触发器 */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* 侧边栏 */}
        <aside 
           className={`${
             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
           } lg:translate-x-0 fixed lg:static z-30 w-64 bg-white dark:bg-gray-800 shadow-lg h-[calc(100vh-4rem)] flex-shrink-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <i className="fa-solid fa-cogs text-blue-600 dark:text-blue-400 mr-2"></i>
              管理后台
            </h2>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}onClick={() => setSidebarOpen(false)}
                  >
                    <i className={`${item.icon} mr-3`}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <i className="fa-solid fa-sign-out mr-3"></i>
                退出登录
              </button>
            </div>
          </nav>
        </aside>
        
        {/* 主内容区域 */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {navItems.find(item => location.pathname === item.path)?.label || '管理后台'}
              </h1>
              
              <button
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setSidebarOpen(true)}
              >
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            </div>
            
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// 管理页面的标题组件
export const AdminPageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
};