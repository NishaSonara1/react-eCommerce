export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  discountPercentage?: number;
  description?: string;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  images?: string[];
}
