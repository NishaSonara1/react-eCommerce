import api from './api';
import { Product } from '../types';

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * function to get list of product
 * @returns product list
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ProductResponse>('/products');
    return response.data.products.map(product => ({
      ...product,
      quantity: 1,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
