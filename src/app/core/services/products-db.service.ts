import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { Product } from '../models/product.model';

export type { Product };

@Injectable({ providedIn: 'root' })
export class ProductsDbService {

  /** GET ALL */
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('title');

    if (error) {
      console.error(error);
      return [];
    }
    return data ?? [];
  }

  /** GET BY ID */
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }
    return data;
  }

  /** ADD */
  async add(product: Product) {
    const { error } = await supabase
      .from('products')
      .insert(product);
    if (error) throw error;
  }

  /** UPDATE */
  async update(id: string, product: Partial<Product>) {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id);
    if (error) throw error;
  }

  /** DELETE */
  async remove(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
