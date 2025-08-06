import { Software, SoftwareFormData } from '@/types';
import { getSections } from './sectionService';

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// 获取所有软件
export const getSoftwares = (): Software[] => {
  const stored = localStorage.getItem('softwares');
  return stored ? JSON.parse(stored) : [];
};

// 获取特定板块的软件
export const getSoftwaresBySection = (sectionId: string): Software[] => {
  const softwares = getSoftwares();
  return softwares.filter(software => software.sectionId === sectionId);
};

// 获取单个软件
export const getSoftwareById = (id: string): Software | undefined => {
  const softwares = getSoftwares();
  return softwares.find(software => software.id === id);
};

// 添加软件
export const addSoftware = (softwareData: SoftwareFormData): Software => {
  const softwares = getSoftwares();
  const newSoftware: Software = {
    ...softwareData,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  softwares.push(newSoftware);
  localStorage.setItem('softwares', JSON.stringify(softwares));
  return newSoftware;
};

// 更新软件
export const updateSoftware = (id: string, softwareData: Partial<SoftwareFormData>): Software | null => {
  const softwares = getSoftwares();
  const index = softwares.findIndex(software => software.id === id);
  
  if (index === -1) return null;
  
  const updatedSoftware = {
    ...softwares[index],
    ...softwareData,
    updatedAt: new Date()
  };
  
  softwares[index] = updatedSoftware;
  localStorage.setItem('softwares', JSON.stringify(softwares));
  return updatedSoftware;
};

// 删除软件
export const deleteSoftware = (id: string): boolean => {
  const softwares = getSoftwares();
  const newSoftwares = softwares.filter(software => software.id !== id);
  
  if (softwares.length === newSoftwares.length) return false;
  
  localStorage.setItem('softwares', JSON.stringify(newSoftwares));
  return true;
};

// 初始化示例数据
 export const initializeSoftwareData = () => {
   // 获取现有的板块数据
    if (!localStorage.getItem('softwares')) {
     const sampleSoftwares: Software[] = [
        {
          id: generateId(),
          name: "DataViz Pro",
          description: "专业数据可视化工具，支持多种图表类型和数据导入格式",
          version: "2.3.1",
          releaseDate: "2025-06-15",
          category: "生产力",
          downloadUrl: "#",
         imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Data%20Visualization%20Software%20Interface%20Modern%20Design&sign=09da9fab57d545fa662d6f4d73f0d1b5",
         features: ["20+图表类型", "实时数据更新", "自定义主题", "多格式导出"],
         createdAt: new Date(),
         updatedAt: new Date()
       },
       {
         id: generateId(),
         name: "CodeMaster IDE",
         description: "轻量级集成开发环境，支持多语言和插件扩展",
         version: "1.8.5",
         releaseDate: "2025-07-22",
          category: "开发工具",
          downloadUrl: "#",
         imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=IDE%20Software%20Code%20Editor%20Interface&sign=7b2aa175d506751de26000046aa2c595",
         features: ["智能代码补全", "内置终端", "Git集成", "主题定制"],
         createdAt: new Date(),
         updatedAt: new Date()
       },
       {
         id: generateId(),
         name: "SecureVault",
         description: "企业级密码管理和数据加密工具",
         version: "3.1.0",
         releaseDate: "2025-05-30",
          category: "安全",
          downloadUrl: "#",
         imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Security%20Software%20Password%20Manager&sign=adc4cf31bf6df342a5f32844ce910509",
         features: ["AES-256加密", "自动填充", "双重认证", "安全共享"],
         createdAt: new Date(),
         updatedAt: new Date()
       }
    ];
    
    localStorage.setItem('softwares', JSON.stringify(sampleSoftwares));
  }
};