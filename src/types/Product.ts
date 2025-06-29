// /types/Product.ts

export interface Image {
  url: string;
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
  createdAt?: string;
  createdBy?: string;
}