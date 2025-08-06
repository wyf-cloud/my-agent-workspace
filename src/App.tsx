 import { Routes, Route, useLocation } from "react-router-dom";
 import { useState } from "react";
 import { AnimatePresence, motion } from "framer-motion";
  import { AuthContext, AuthProvider } from '@/contexts/authContext';
 
 // 页面导入
 import Home from "@/pages/Home";
 import SoftwareDetail from "@/pages/SoftwareDetail";
 import AdminLogin from "@/pages/Admin/Login";
 import { AdminLayout } from "@/components/layout/AdminLayout";
  import Dashboard from "@/pages/Admin/Dashboard";
  import SoftwareManagement from "@/pages/Admin/SoftwareManagement";
  import { SoftwareForm } from "@/components/admin/SoftwareForm";
 import { SectionForm } from "@/components/admin/SectionForm";
 
 export default function App() {
   const location = useLocation();
   const [isAuthenticated, setIsAuthenticated] = useState(false);
 
   const logout = () => {
     setIsAuthenticated(false);
   };
 
   return (
     <AuthContext.Provider
       value={{ isAuthenticated, setIsAuthenticated, logout }}
     >
         <AnimatePresence mode="wait">
           <Routes location={location} key={location.pathname}>
              {/* 前台路由 */}
              <Route path="/" element={
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Home />
                </motion.div>
              } />

              <Route path="/software/:id" element={<SoftwareDetail />} />
             
             {/* 管理员登录 */}
             <Route path="/admin/login" element={
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.5 }}
               >
                 <AdminLogin />
               </motion.div>
             } />
             
             {/* 管理员后台路由 */}
             <Route path="/admin" element={<AdminLayout />}>
               <Route path="dashboard" element={<Dashboard />} />
               <Route path="software" element={<SoftwareManagement />} />
               <Route path="software/new" element={<SoftwareForm />} />
               <Route path="software/edit/:id" element={<SoftwareForm isEditing={true} />} />

             </Route>
             
             {/* 404页面 */}
             <Route path="*" element={<div className="text-center text-xl py-10">页面未找到</div>} />
           </Routes>
         </AnimatePresence>
     </AuthContext.Provider>
   );
 }
