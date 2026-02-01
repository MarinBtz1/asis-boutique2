import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { Category } from '../models/category.model';

export type { Category };

@Injectable({ providedIn: 'root' })
export class CategoriesDbService {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }
}
