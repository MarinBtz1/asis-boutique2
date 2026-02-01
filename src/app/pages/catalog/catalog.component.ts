import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductsDbService, Product } from '../../core/services/products-db.service';
import { CategoriesDbService, Category } from '../../core/services/categories-db.service';
import { ItemCardComponent } from '../../shared/item-card/item-car.component';

@Component({
  standalone: true,
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule, ItemCardComponent],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];

  q = '';
  category = 'Toate';

  categories: string[] = [];

  loading = true;
  error = '';

  constructor(private productsDb: ProductsDbService, private categoriesDb: CategoriesDbService) {}

  async ngOnInit() {
    try {
      this.loading = true;

      const [products, categories] = await Promise.all([
        this.productsDb.getAll(),
        this.categoriesDb.getAll()
      ]);

      this.products = products;
      this.filtered = [...this.products];

      this.categories = [
        'Toate',
        ...categories.map(c => c.name)
      ];
    } catch {
      this.error = 'Eroare la încărcarea datelor';
    } finally {
      this.loading = false;
    }
  }

  applyFilter() {
    this.filtered = this.products.filter(p => {
      const matchesCategory =
        this.category === 'Toate' || p.category === this.category;

      const q = this.q.toLowerCase();
      const matchesQuery =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }
}
