import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsDbService {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  }

  async add(item: Omit<Product, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(item)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, item: Partial<Omit<Product, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('products')
      .update(item)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
