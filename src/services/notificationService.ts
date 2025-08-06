import { Notification } from '@/types';

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// 获取通知
export const getNotification = (): Notification | null => {
  const stored = localStorage.getItem('notification');
  if (!stored) return null;
  
  const notification = JSON.parse(stored);
  // 转换字符串日期为Date对象
  if (notification) {
    notification.createdAt = new Date(notification.createdAt);
    notification.updatedAt = new Date(notification.updatedAt);
  }
  return notification;
};

// 保存通知
export const saveNotification = (content: string, direction: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top', pauseDuration: number = 3): Notification => {
  let notification = getNotification();
  
  if (notification) {
    notification.content = content;
    notification.direction = direction;
    notification.pauseDuration = pauseDuration;
    notification.updatedAt = new Date();
  } else {
    notification = {
      id: generateId(),
      content,
      enabled: true,
      direction,
      pauseDuration,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  localStorage.setItem('notification', JSON.stringify(notification));
  return notification;
}

// 初始化默认通知（如果不存在）
export const initializeNotificationData = () => {
  if (!localStorage.getItem('notification')) {
  const defaultNotification: Notification = {
    id: generateId(),
    content: "欢迎使用SoftwareHub！我们已更新隐私政策，详情请查看相关页面。",
    enabled: true,
    direction: 'bottom-to-top',
    pauseDuration: 3, // 默认停留3秒
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  localStorage.setItem('notification', JSON.stringify(defaultNotification));
}
};