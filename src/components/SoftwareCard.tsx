import { Software } from '@/types';
import { Link } from 'react-router-dom';

interface SoftwareCardProps {
  software: Software;
}

export const SoftwareCard = ({ software }: SoftwareCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={software.imageUrl} 
          alt={software.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          v{software.version}
        </div>
      </div>
      
      <div className="p-5">
        <Link to={`/software/${software.id}`}>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {software.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {software.description}
        </p>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-4">
          <i className="fa-regular fa-calendar mr-1"></i>
          <span>{new Date(software.releaseDate).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <i className="fa-regular fa-folder mr-1"></i>
          <span>{software.category}</span>
        </div>
        
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">主要特性:</h4>
          <ul className="flex flex-wrap gap-2">
            {software.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                {feature}
              </li>
            ))}
            {software.features.length > 3 && (
              <li className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                +{software.features.length - 3} 更多
              </li>
            )}
          </ul>
        </div>
        
        <div className="flex space-x-2">
          <Link 
            to={software.downloadUrl}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center text-sm transition-colors flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-download mr-1"></i> 下载
          </Link>
          
          <Link 
            to={`/software/${software.id}`}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg text-center text-sm transition-colors"
          >
            详情
          </Link>
        </div>
      </div>
    </div>
  );
};