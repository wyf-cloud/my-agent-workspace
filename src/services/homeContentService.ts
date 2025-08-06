import { HomeContent } from '@/types';

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// 获取首页内容
export const getHomeContent = (): HomeContent | null => {
  const stored = localStorage.getItem('homeContent');
  if (!stored) return null;
  
  const homeContent = JSON.parse(stored);
  if (homeContent) {
    homeContent.updatedAt = new Date(homeContent.updatedAt);
  }
  return homeContent;
};

// 保存首页内容
export const saveHomeContent = (heroTitle: string, heroSubtitle: string): HomeContent => {
  let homeContent = getHomeContent();
  
  if (homeContent) {
    homeContent.heroTitle = heroTitle;
    homeContent.heroSubtitle = heroSubtitle;
    homeContent.updatedAt = new Date();
  } else {
    homeContent = {
      id: generateId(),
      heroTitle,
      heroSubtitle,
      updatedAt: new Date()
    };
  }
  
  localStorage.setItem('homeContent', JSON.stringify(homeContent));
  return homeContent;
};

// 初始化默认首页内容（如果不存在）
export const initializeHomeContent = () => {
  if (!localStorage.getItem('homeContent')) {
    const defaultHomeContent: HomeContent = {
      id: generateId(),
      heroTitle: "发现优质软件，提升工作效率",
      heroSubtitle: "精选各类实用软件，涵盖开发工具、生产力应用和安全解决方案，助您轻松应对各种任务挑战。",
      updatedAt: new Date()
    };
    
    localStorage.setItem('homeContent', JSON.stringify(defaultHomeContent));
  }
};