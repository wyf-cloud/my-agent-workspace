export interface Software {
  id: string;
  name: string;
  description: string;
  version: string;
  releaseDate: string;
  category: string;

  downloadUrl: string;
  imageUrl: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type SoftwareFormData = Omit<Software, 'id' | 'createdAt' | 'updatedAt'>;

export interface Notification {
  id: string;
  content: string;
  enabled: boolean;
  direction: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
  pauseDuration: number; // 停留时间（秒）
  createdAt: Date;
  updatedAt: Date;
}

export interface HomeContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  updatedAt: Date;
}
