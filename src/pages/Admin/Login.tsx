import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { Navbar } from '@/components/layout/Navbar';
import { toast } from 'sonner';

export default function AdminLogin() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 模拟管理员账户
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'password123'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('请输入用户名和密码');
      return;
    }
    
    setLoading(true);
    
    // 模拟登录请求延迟
    setTimeout(() => {
      if (credentials.username === ADMIN_CREDENTIALS.username && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
        toast.success('登录成功，欢迎回来！');
        navigate('/admin/dashboard');
      } else {
        setError('用户名或密码不正确');
        toast.error('登录失败，请检查您的凭据');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-700 p-6 text-center">
            <i className="fa-solid fa-lock text-white text-4xl mb-3"></i>
            <h2 className="text-2xl font-bold text-white">管理员登录</h2>
            <p className="text-blue-100 mt-1">请输入管理员凭据以访问后台</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 px-4 py-3 rounded mb-4 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-2"></i> {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  用户名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-regular fa-user text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="输入管理员用户名"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-key text-gray-400"></i>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="输入管理员密码"
                    disabled={loading}
                  />
                </div>
              </div>
              
               <button
                 type="submit"
                 disabled={loading}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
               >
                 {loading ? (
                   <>
                     <i className="fa-solid fa-spinner fa-spin mr-2"></i> 登录中...
                   </>
                 ) : (
                   <>
                     <i className="fa-solid fa-sign-in mr-2"></i> 登录
                   </>
                 )}
               </button>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>使用模拟管理员账户登录：</p>
              <p className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">用户名: admin</p>
              <span className="mx-2">|</span>
              <p className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">密码: password123</p>
            </div>
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          不是管理员？ <a href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">返回首页</a>
        </p>
      </div>
    </div>
  );
};