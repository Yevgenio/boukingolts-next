// /types/Product.ts

import { Image } from './Image';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: Image[];
  rank?: number;
  featured?: number;
  tags?: string[];
  price?: number;
  salePercent?: number;
  createdAt?: string;
  createdBy?: string;
}