import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, CurrencyPipe } from '@angular/common';
import { ProductsDbService } from '../../core/services/products-db.service';
import { Product } from '../../core/models/product.model';

@Component({
  standalone: true,
  imports: [NgIf, RouterLink, CurrencyPipe],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  loading = true;
  error = '';
  product: Product | null = null;

  constructor(private route: ActivatedRoute, private db: ProductsDbService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      const id = this.route.snapshot.paramMap.get('id')!;
      this.product = await this.db.getById(id);
    } catch (e: any) {
      this.error = e?.message ?? 'Produs inexistent.';
    } finally {
      this.loading = false;
    }
  }
}
