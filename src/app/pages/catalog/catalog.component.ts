import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../features/product-card/product-card.component';
import { ProductsDbService } from '../../core/services/products-db.service';
import { CategoriesDbService } from '../../core/services/categories-db.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { FormsModule } from '@angular/forms';



@Component({
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, ProductCardComponent, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  loading = true;
  error = '';
  q = '';
  categoryId = 'ALL';

  products: Product[] = [];
  filtered: Product[] = [];
  categories: Category[] = [];

  constructor(
    private productsDb: ProductsDbService,
    private categoriesDb: CategoriesDbService
  ) {}

  async ngOnInit() {
    const products = await this.productsDb.getAll();
    console.log('PRODUCTS FROM SUPABASE:', products);
  }

  applyFilters() {
    const q = this.q.trim().toLowerCase();
    this.filtered = this.products.filter(p => {
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);

      const matchesCat =
        this.categoryId === 'ALL' || p.category_id === this.categoryId;

      return matchesQ && matchesCat;
    });
  }
}
