import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addSoftware, getSoftwareById, updateSoftware } from '@/services/softwareService';
import { Software, SoftwareFormData } from '@/types';
import { toast } from 'sonner';

interface SoftwareFormProps {
  isEditing?: boolean;
  initialData?: Software;
}

export const SoftwareForm = ({ isEditing = false, initialData }: SoftwareFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<SoftwareFormData>({
    name: '',
    description: '',
    version: '',
    releaseDate: '',
    category: '',

    downloadUrl: '#',
    imageUrl: '',
    features: []
  });
  const [featureInput, setFeatureInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // 如果是编辑模式，加载软件数据
    const loadSoftwareData = async () => {
      if (!isEditing || !id) return;
      
      try {
        setLoading(true);
        const softwareData = getSoftwareById(id);
        
        if (!softwareData) {
          toast.error('未找到软件数据');
          navigate('/admin/software');
          return;
        }
        
        setFormData({
          name: softwareData.name,
          description: softwareData.description,
          version: softwareData.version,
          releaseDate: softwareData.releaseDate,
          category: softwareData.category,
          sectionId: softwareData.sectionId,
          downloadUrl: softwareData.downloadUrl,
          imageUrl: softwareData.imageUrl,
          features: softwareData.features
        });
      } catch (error) {
        console.error('Error loading software data:', error);
        toast.error('加载软件数据失败');
        navigate('/admin/software');
      } finally {
        setLoading(false);
      }
    };
 
     loadSoftwareData();
   }, [isEditing, id, navigate, formData.sectionId]);

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // 处理文件选择和拖拽的通用方法
  const handleFile = (file: File) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }
    
    // 检查文件大小 (限制5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // 创建图片预览
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      // 同时更新imageUrl字段
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // 处理图片上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // 清除选中的图片
  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    // 重置文件输入
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureAdd = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleFeatureRemove = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.name.trim()) {
      toast.error('请输入软件名称');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('请输入软件描述');
      return;
    }
    
    if (!formData.version.trim()) {
      toast.error('请输入软件版本');
      return;
    }
    
    if (!formData.releaseDate) {
      toast.error('请选择发布日期');
      return;
    }

    
     // 检查图片URL或上传文件
     if (!formData.imageUrl.trim() && !selectedFile) {
       toast.error('请输入软件图片URL或上传图片');
       return;
     }
    
    if (formData.features.length === 0) {
      toast.error('请至少添加一个软件特性');
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (isEditing && id) {
        // 更新软件
        const updatedSoftware = updateSoftware(id, formData);
        if (updatedSoftware) {
          toast.success('软件更新成功');
          navigate('/admin/software');
        } else {
          toast.error('更新软件失败');
        }
      } else {
        // 添加新软件
        addSoftware(formData);
        toast.success('软件添加成功');
        navigate('/admin/software');
      }
    } catch (error) {
      console.error('Error saving software:', error);
      toast.error(isEditing ? '更新软件失败' : '添加软件失败');
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditing ? '编辑软件' : '添加新软件'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">软件名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="输入软件名称"
                required
              />
            </div>
            
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                版本号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="version"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="例如：1.0.0"
                required
              />
            </div>
            
            <div>
              <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                发布日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                分类
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="输入软件分类"
              />
            </div>
            

          </div>
          
          {/* 详细信息 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                下载链接
              </label>
              <input
                type="url"
                id="downloadUrl"
                name="downloadUrl"
                value={formData.downloadUrl}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="软件下载链接"
              />
            </div>
            
             <div>
               <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 图片URL <span className="text-red-500">*</span>
               </label>
               <input
                 type="url"
                 id="imageUrl"
                 name="imageUrl"
                 value={formData.imageUrl}
                 onChange={handleChange}
                 className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                 placeholder="软件图片URL"
                 required
                 disabled={!!selectedFile}
               />
               <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                 建议尺寸：400x300像素
               </p>
             </div>

             {/* 图片上传区域 */}
             <div className="mt-6">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 或本地上传图片 <span className="text-red-500">*</span>
               </label>
               
               {/* 图片预览 */}
               {imagePreview ? (
                 <div className="mb-4 relative group">
                   <img 
                     src={imagePreview} 
                     alt="预览" 
                     className="w-full max-w-xs h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                   />
                   <button
                     type="button"
                     onClick={handleClearImage}
                     className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full text-gray-600 dark:text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <i className="fa-solid fa-times"></i>
                   </button>
                 </div>
               ) : (
                      <label
                        htmlFor="imageUpload"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          isDragging 
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750'
                        }`}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full text-center">
                          <i className={`fa-solid ${isDragging ? 'fa-cloud-arrow-down' : 'fa-cloud-upload'} text-3xl ${isDragging ? 'text-blue-500' : 'text-gray-400'} mb-2`}></i>
                          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">{isDragging ? '释放文件' : '点击上传'}</span> 或拖放文件
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">支持 PNG, JPG 或 GIF (最大 5MB)</p>
                        </div>
                        <input 
                          id="imageUpload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </label>
               )}
             </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                软件描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="详细描述软件功能和特点"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                软件特性 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleFeatureAdd()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="添加特性并按回车"
                />
                <button
                  type="button"
                  onClick={handleFeatureAdd}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  添加
                </button>
              </div>
              
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleFeatureRemove(index)}
                        className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <span className="sr-only">移除特性</span>
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/admin/software')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-1"></i> 保存中...
              </>
            ) : isEditing ? (
              '更新软件'
            ) : (
              '添加软件'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};