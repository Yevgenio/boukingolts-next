// /types/Product.ts

export interface Image {
  url: string;
  thumbnail: string; 
  width?: number;
  height?: number;
  _id?: string; // Optional if not assigned in all cases
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: Image[];
  rank?: number;
  featured?: boolean;
  tags?: string[];
  price?: number;
  salePercent?: number;
  createdAt?: string;
  createdBy?: string;
}