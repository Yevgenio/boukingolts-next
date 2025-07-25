export interface Event {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  images: import('./Image').Image[];
  date: string;
  location?: string;
  createdAt?: string;
  createdBy?: string;
}