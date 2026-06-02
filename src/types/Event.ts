export interface Event {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  images: import('./Image').Image[];
  date: string;
  location?: string;
  artist?: 'elena' | 'alexey' | 'archive';
  createdAt?: string;
  createdBy?: string;
}