import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Navbar } from '@/components/layout/Navbar';
import { SectionCard } from '@/components/SectionCard';
import { SoftwareCard } from '@/components/SoftwareCard';
import { getSoftwares } from '@/services/softwareService';
import { initializeSoftwareData } from '@/services/softwareService';
import { getNotification, initializeNotificationData } from '@/services/notificationService';
import { getHomeContent, initializeHomeContent } from '@/services/homeContentService';
import { Notification, HomeContent } from '@/types';
 
export default function Home() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  
// 初始化示例数据
useEffect(() => {
  initializeSoftwareData();
  initializeNotificationData();
  initializeHomeContent();
  
  // 获取数据
  const fetchData = () => {
    // 获取通知数据
    const notificationData = getNotification();
    setNotification(notificationData);
    
    // 获取首页内容数据
    const contentData = getHomeContent();
    setHomeContent(contentData);
  };
  
  fetchData();
  
  // 设置轮询检查更新（每30秒）
  const intervalId = setInterval(fetchData, 30000);
  
  return () => clearInterval(intervalId);
}, []);

 // 获取板块和软件数据
const softwares = getSoftwares();
 const featuredSoftwares = softwares.slice(0, 4); // 只展示前4个作为精选

 return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
       <Navbar />
       
       {/* 英雄区域 */}
          <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
           <div className="max-w-7xl mx-auto text-center relative z-10">
               <motion.h1 
                 initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                 animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                 transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg"
               >
                 {homeContent?.heroTitle || '发现优质软件，提升工作效率'}
               </motion.h1>
               <motion.p 
                 initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                 animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                 transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                 className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 drop-shadow-md"
               >
                 {homeContent?.heroSubtitle || '精选各类实用软件，涵盖开发工具、生产力应用和安全解决方案，助您轻松应对各种任务挑战。'}
               </motion.p>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="flex flex-col sm:flex-row justify-center gap-4"
             >

             </motion.div>
           </div>
           
           {/* 装饰元素 */}
            {/* 动态背景动画元素 */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
          </section>
          
          {/* 滚动通知区域 */}
           <section className="bg-blue-50 dark:bg-blue-900/20 py-3 overflow-hidden">
               <div className="relative overflow-hidden h-8 flex items-center">
                 <div className={`text-sm font-medium text-blue-800 dark:text-blue-300 transition-transform duration-500 mx-auto text-center ${
                  notification?.direction === 'left-to-right' 
                    ? 'animate-marquee-left-to-right whitespace-nowrap' 
                    : notification?.direction === 'right-to-left'
                    ? 'animate-marquee-right-to-left whitespace-nowrap'
                    : notification?.direction === 'top-to-bottom'
                    ? 'animate-marquee-down absolute w-full'
                    : 'animate-marquee-up absolute w-full text-center'
                }`} style={{animationDuration: `15s`, animationDelay: `${notification?.pauseDuration || 3}s`}}>
                  {notification?.enabled ? notification.content : ''}
                </div>
             </div>
           </section>
       

       
       {/* 精选软件区域 */}
       <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 max-w-7xl mx-auto w-full">
         <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">精选软件</h2>
           <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
             我们精心挑选的热门软件，帮助您提升工作效率和创造力
           </p>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {featuredSoftwares.map((software) => (
             <SoftwareCard key={software.id} software={software} />
           ))}
         </div>
         
         <div className="text-center mt-10">
           <a 
             href="#" 
             className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
           >
             查看全部软件 <i className="fa-solid fa-arrow-right ml-2"></i>
           </a>
         </div>
       </section>
       
       {/* 页脚 */}
       <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-center">
             <div className="mb-6 md:mb-0">
                <div className="flex items-center">
                  <img src="https://lf-code-agent.coze.cn/obj/x-ai-cn/64236443138/attachment/LOGO_1_20250806085544.jpg" alt="蟹老板的软件屋" className="h-8 w-auto mr-2" />
                  <span className="font-bold text-xl">蟹老板的软件屋</span>
               </div>
               <p className="text-gray-400 mt-2 text-sm">优质软件展示平台</p>
             </div>
             
          <div className="flex flex-col items-center">
            <div className="flex space-x-6 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-github text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-linkedin text-xl"></i>
              </a>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img 
                src="https://lf-code-agent.coze.cn/obj/x-ai-cn/64236443138/attachment/5a4da1c4fc1900fb3f44e4000a3ee202_20250806085800.jpg" 
                alt="二维码" 
                className="w-24 h-24 object-contain"
              />
            </div>
             <p className="text-xs text-gray-400 mt-2">扫码加微信好友</p>
          </div>
           </div>
           
           <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
             <p className="text-gray-400 text-sm">© 2025 SoftwareHub. 保留所有权利。</p>
             <div className="flex space-x-6 mt-4 md:mt-0">
               <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">隐私政策</a>
               <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">使用条款</a>
               <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">联系我们</a>
             </div>
           </div>
         </div>
       </footer>
     </div>
   );
 }