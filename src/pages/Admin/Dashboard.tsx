  import { useEffect, useState } from 'react';
  import { Link } from 'react-router-dom';
  import { getSoftwares } from '@/services/softwareService';
  import { AdminPageHeader } from '@/components/layout/AdminLayout';
   import { NotificationForm } from '@/components/admin/NotificationForm';
   import { HomeContentForm } from '@/components/admin/HomeContentForm';
  
  
  export default function Dashboard() {
    const [stats, setStats] = useState({
      totalSoftwares: 0,
      recentSoftwares: [] as any[]
    });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   useEffect(() => {
     const fetchData = () => {
       setLoading(true);
       setError(null);
       
     try {
       const softwares = getSoftwares();
       
       // 按创建时间排序，获取最近的5个软件
       const recentSoftwares = [...softwares]
         .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
         .slice(0, 5);
       
       setStats({
         totalSoftwares: softwares.length,
         recentSoftwares
       });
     } catch (error) {
         console.error('Error fetching dashboard data:', error);
         setError('加载数据失败，请刷新页面重试');
       } finally {
         setLoading(false);
       }
     };
     
     fetchData();
   }, []);
 
   if (loading) {
     return (
       <div className="flex flex-col items-center justify-center h-64">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
         <p className="text-gray-600 dark:text-gray-400">加载数据中...</p>
       </div>
     );
   }
 
   if (error) {
     return (
       <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
         <div className="flex items-start">
           <i className="fa-solid fa-exclamation-circle text-red-500 mt-1 mr-3 text-xl"></i>
           <div>
             <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">数据加载失败</h3>
             <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
             <button 
               onClick={() => window.location.reload()}
               className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
             >
               重试
             </button>
           </div>
         </div>
       </div>
     );
   }
 
   return (
     <div>
       <AdminPageHeader 
         title="仪表盘" 
         subtitle="查看系统概览和最近活动" 
       />
       
       {/* 统计卡片 */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">软件总数</p>
               <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalSoftwares}</h3>
               <p className="text-xs text-green-500 mt-2 flex items-center">
                 <i className="fa-solid fa-arrow-up mr-1"></i> 较上月增长 12%
               </p>
             </div>
             <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
               <i className="fa-regular fa-file-code text-blue-600 dark:text-blue-400 text-xl"></i>
             </div>
           </div>
         </div>
         
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">本月新增</p>
               <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                 {stats.recentSoftwares.filter(s => {
                   const createdAt = new Date(s.createdAt);
                   const now = new Date();
                   return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
                 }).length}
               </h3>
               <p className="text-xs text-green-500 mt-2 flex items-center">
                 <i className="fa-solid fa-arrow-up mr-1"></i> 较上月增长 8%
               </p>
             </div>
             <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
               <i className="fa-solid fa-rocket text-green-600 dark:text-green-400 text-xl"></i>
             </div>
           </div>
         </div>
       </div>
       
         {/* 最近软件 */}
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">最近添加的软件</h2>
             <Link 
               to="/admin/software" 
               className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
             >
               查看全部
             </Link>
           </div>
           
           {stats.recentSoftwares.length > 0 ? (
             <ul className="space-y-4">
               {stats.recentSoftwares.map((software) => (
                 <li key={software.id} className="flex items-start p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                   <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded flex items-center justify-center text-blue-600 dark:text-blue-400">
                     <i className="fa-regular fa-file-code"></i>
                   </div>
                   <div className="ml-3 flex-1">
                     <Link 
                       to={`/admin/software/edit/${software.id}`}
                       className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                     >
                       {software.name}
                     </Link>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                       {new Date(software.createdAt).toLocaleString()}
                     </p>
                   </div>
                 </li>
               ))}
             </ul>
           ) : (
             <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
               <i className="fa-regular fa-file-code text-4xl mb-3 opacity-30"></i>
               <p>暂无软件数据</p>
               <Link 
                 to="/admin/software/new" 
                 className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
               >
                 添加新软件
               </Link>
             </div>
           )}
         </div>
         
         {/* 快速操作 */}
         <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">快速操作</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Link
               to="/admin/software/new"
               className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
             >
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                 <i className="fa-solid fa-plus text-xl"></i>
               </div>
               <span className="text-sm font-medium text-gray-900 dark:text-white">添加软件</span>
             </Link>
             
             <Link
               to="/admin/software"
               className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
             >
               <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                 <i className="fa-solid fa-list text-xl"></i>
               </div>
               <span className="text-sm font-medium text-gray-900 dark:text-white">管理软件</span>
             </Link>
          </div>
          
          {/* 通知设置 */}
           <div className="grid grid-cols-1 gap-8 mt-8">
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">首页内容设置</h2>
               <HomeContentForm />
             </div>
             
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">通知设置</h2>
               <NotificationForm />
             </div>
           </div>
       </div>
      </div>
    );
  };