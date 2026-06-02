// /types/Product.ts

import { Image } from './Image';

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: Image[];
  rank?: number;
  featured?: number;
  tags?: string[];
  series?: string;
  dimensions?: number[];
  dimensionUnit?: string;
  year?: number;
  forSale?: boolean;
  specs?: ProductSpec[];
  price?: number;
  salePercent?: number;
  artist?: 'elena' | 'alexey' | 'archive';
  createdAt?: string;
  createdBy?: string;
}