import { useState, useEffect } from 'react';
import { getNotification, saveNotification } from '@/services/notificationService';
import { Notification } from '@/types';
import { toast } from 'sonner';

export const NotificationForm = () => {
  const [content, setContent] = useState('');
  const [direction, setDirection] = useState<'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top'>('bottom-to-top');
  const [pauseDuration, setPauseDuration] = useState(3);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotification = () => {
      try {
        setLoading(true);
        const notification = getNotification();
         if (notification) {
            setContent(notification.content);
            setDirection(notification.direction || 'bottom-to-top');
            setPauseDuration(notification.pauseDuration || 3);
         }
      } catch (error) {
        console.error('Error fetching notification:', error);
        toast.error('加载通知失败');
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('通知内容不能为空');
      return;
    }
    
    setSubmitting(true);
    
    try {
        saveNotification(content, direction, pauseDuration);
      toast.success('通知更新成功');
    } catch (error) {
      console.error('Error saving notification:', error);
      toast.error('保存通知失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">通知设置</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="notificationContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            通知内容
          </label>
          <textarea
            id="notificationContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={4}
            placeholder="输入滚动通知内容..."
            required
          ></textarea>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            通知内容将在首页顶部滚动显示
          </p>
         </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                滚动方向
              </label>
              <div className="space-y-3">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    value="left-to-right"
                    checked={direction === 'left-to-right'}
                    onChange={() => setDirection('left-to-right')}
                    className="text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">从左到右</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    value="right-to-left"
                    checked={direction === 'right-to-left'}
                    onChange={() => setDirection('right-to-left')}
                    className="text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">从右到左</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    value="top-to-bottom"
                    checked={direction === 'top-to-bottom'}
                    onChange={() => setDirection('top-to-bottom')}
                    className="text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">从上到下</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    value="bottom-to-top"
                    checked={direction === 'bottom-to-top'}
                    onChange={() => setDirection('bottom-to-top')}
                    className="text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">从下到上</span>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="pauseDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                中间停留时间（秒）
              </label>
              <input
                type="number"
                id="pauseDuration"
                min="1"
                max="10"
                value={pauseDuration}
                onChange={(e) => setPauseDuration(parseInt(e.target.value) || 3)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                通知滚动到中间位置后停留的时间（1-10秒）
              </p>
            </div>
          </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-1"></i> 保存中...
              </>
            ) : (
              '保存通知'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};