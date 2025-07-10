import { Image } from './Image';

export interface BaseContent {
    enabled: boolean;
    order: number;
}

export interface HeroContent extends BaseContent {
    title: string;
    paragraph: string;
    images: Image[];
    tint: string;
}

export interface TestimonialItem {
    author: string;
    comment: string;
}

export interface TestimonialsContent extends BaseContent {
  testimonials: TestimonialItem[];
}

export interface AboutContent extends BaseContent {
    name: string;
    address: string;
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    images: Image[];
    comment: string;
}