import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteSoftware, getSoftwares } from '@/services/softwareService';
import { getSectionById } from '@/services/sectionService';
import { AdminPageHeader } from '@/components/layout/AdminLayout';
import { Software } from '@/types';
import { toast } from 'sonner';

export default function SoftwareManagement() {
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const navigate = useNavigate();

  // 获取所有软件数据
  const fetchSoftwares = () => {
    setLoading(true);
    try {
      const data = getSoftwares();
      setSoftwares(data);
    } catch (error) {
      console.error('Error fetching softwares:', error);
      toast.error('加载软件数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoftwares();
  }, []);

  // 处理删除软件
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确定要删除软件 "${name}" 吗？此操作不可恢复。`)) {
      try {
        const success = deleteSoftware(id);
        if (success) {
          toast.success('软件已成功删除');
          fetchSoftwares(); // 重新获取数据
        } else {
          toast.error('删除软件失败');
        }
      } catch (error) {
        console.error('Error deleting software:', error);
        toast.error('删除软件时出错');
      }
    }
  };

  // 过滤软件列表
  const filteredSoftwares = softwares.filter(software => {
    return software.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           software.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 获取所有唯一的板块ID
  const uniqueSectionIds = Array.from(new Set(softwares.map(software => software.sectionId)));

  return (
    <div>
      <AdminPageHeader 
        title="软件管理" 
        subtitle="查看、编辑和管理所有软件信息" 
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">软件列表</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                共 {softwares.length} 个软件
              </p>
            </div>
            
            <Link
              to="/admin/software/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fa-solid fa-plus mr-2"></i> 添加新软件
            </Link>
          </div>
          
          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="搜索软件名称或描述..."
              />
            </div>
            

          </div>
          
          {/* 软件列表 */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredSoftwares.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <i className="fa-regular fa-file-code text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">未找到软件</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                {searchTerm || sectionFilter !== 'all' 
                  ? '没有符合当前筛选条件的软件。请尝试调整搜索或筛选条件。' 
                  : '系统中暂无软件数据。请添加您的第一个软件。'}
              </p>
              {!searchTerm && sectionFilter === 'all' && (
                <Link
                  to="/admin/software/new"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <i className="fa-solid fa-plus mr-2"></i> 添加新软件
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-750">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      软件名称
                    </th>

                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      版本
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      发布日期
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSoftwares.map((software) => {
                     return (
                       <tr key={software.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center">
                             <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/40 rounded flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                               <i className="fa-regular fa-file-code"></i>
                             </div>
                             <div>
                               <div className="text-sm font-medium text-gray-900 dark:text-white">
                                 {software.name}
                               </div>
                               <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                 {software.description}
                               </div>
                             </div>
                           </div>
                         </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          v{software.version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(software.releaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="inline-flex rounded-md shadow-sm">
                            <Link
                              to={`/software/${software.id}`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-l-md text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-regular fa-eye mr-1"></i> 查看
                            </Link>
                            <Link
                              to={`/admin/software/edit/${software.id}`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                              <i className="fa-solid fa-pen-to-square mr-1"></i> 编辑
                            </Link>
                            <button
                              onClick={() => handleDelete(software.id, software.name)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-r-md text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                            >
                              <i className="fa-solid fa-trash mr-1"></i> 删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};