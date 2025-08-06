import { useState, useEffect } from 'react';
import { saveHomeContent, getHomeContent } from '@/services/homeContentService';
import { HomeContent } from '@/types';
import { toast } from 'sonner';

export const HomeContentForm = () => {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchHomeContent = () => {
      try {
        setLoading(true);
        const content = getHomeContent();
        
        if (content) {
          setHeroTitle(content.heroTitle);
          setHeroSubtitle(content.heroSubtitle);
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
        toast.error('加载首页内容失败');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!heroTitle.trim()) {
      toast.error('标题不能为空');
      return;
    }
    
    if (!heroSubtitle.trim()) {
      toast.error('副标题不能为空');
      return;
    }
    
    setSubmitting(true);
    
    try {
      saveHomeContent(heroTitle, heroSubtitle);
      toast.success('首页内容更新成功');
    } catch (error) {
      console.error('Error saving home content:', error);
      toast.error('保存首页内容失败');
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
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">首页内容设置</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            英雄区域标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="heroTitle"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="输入英雄区域标题"
            required
          />
        </div>
        
        <div>
          <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            英雄区域副标题 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="heroSubtitle"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={4}
            placeholder="输入英雄区域副标题"
            required
          ></textarea>
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
              '保存设置'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};