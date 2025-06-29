// /types/Product.ts

export interface Image {
  url: string;
  _id: string;
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