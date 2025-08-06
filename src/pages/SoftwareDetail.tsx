import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSoftwareById, getSoftwares } from '@/services/softwareService';
import { getSectionById } from '@/services/sectionService';
import { Software } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { toast } from 'sonner';

export default function SoftwareDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [software, setSoftware] = useState<Software | null>(null);
  const [sectionName, setSectionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchSoftwareDetails = () => {
      try {
        setLoading(true);
        // 获取所有软件数据
        const allSoftwares = getSoftwares();
        console.log('All softwares:', allSoftwares);
        console.log('Looking for software with id:', id);
        
        // 查找特定软件
        const softwareData = allSoftwares.find(s => s.id === id);
        
        if (!softwareData) {
          setError(`未找到ID为 ${id} 的软件信息`);
          toast.error(`未找到ID为 ${id} 的软件信息`);
          return;
        }
        
        setSoftware(softwareData);
        
      } catch (err) {
        setError('加载软件信息失败: ' + (err instanceof Error ? err.message : String(err)));
        toast.error('加载软件信息失败，请重试');
        console.error('Error fetching software details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSoftwareDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">加载软件详情中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !software) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <i className="fa-solid fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">软件不存在或已被移除</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error || '未找到软件信息'}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.history.back()}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  返回上一页
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-1"></i> 返回
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* 软件图片 */}
            <div className="md:w-1/3 bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center">
              <img 
                src={software.imageUrl} 
                alt={software.name}
                className="max-h-80 object-contain rounded-lg shadow-lg"
              />
            </div>
            
            {/* 软件基本信息 */}
            <div className="md:w-2/3 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>

                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{software.name}</h1>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                  v{software.version}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {software.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fa-regular fa-calendar mr-2 text-gray-400 w-5 text-center"></i>
                  <span>发布日期: {new Date(software.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fa-regular fa-folder mr-2 text-gray-400 w-5 text-center"></i>
                  <span>分类: {software.category}</span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fa-regular fa-clock mr-2 text-gray-400 w-5 text-center"></i>
                  <span>最后更新: {new Date(software.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <i className="fa-regular fa-file-code mr-2 text-gray-400 w-5 text-center"></i>
                  <span>板块: {sectionName}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href={software.downloadUrl}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-download mr-2"></i> 立即下载
                </a>
                <button 
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                  onClick={() => toast.info('功能开发中，敬请期待')}
                >
                  <i className="fa-regular fa-star mr-2"></i> 收藏
                </button>
                <button 
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                  onClick={() => toast.info('功能开发中，敬请期待')}
                >
                  <i className="fa-regular fa-share-from-square mr-2"></i> 分享
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 软件详细信息 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 特性列表 */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="fa-solid fa-list-checks text-blue-600 dark:text-blue-400 mr-2"></i> 软件特性
            </h2>
            
            <ul className="space-y-3">
              {software.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-3"></i>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* 相关信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="fa-solid fa-circle-info text-blue-600 dark:text-blue-400 mr-2"></i> 相关信息
            </h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">发布日期</h3>
                <p className="text-gray-900 dark:text-white">{new Date(software.releaseDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">最后更新</h3>
                <p className="text-gray-900 dark:text-white">{new Date(software.updatedAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">版本号</h3>
                <p className="text-gray-900 dark:text-white">{software.version}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">分类</h3>
                <p className="text-gray-900 dark:text-white">{software.category}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">所属板块</h3>
                <p className="text-gray-900 dark:text-white">未分类</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <a 
                  href="#" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('功能开发中，敬请期待');
                  }}
                >
                  查看版本历史 <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SoftwareHub. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
};