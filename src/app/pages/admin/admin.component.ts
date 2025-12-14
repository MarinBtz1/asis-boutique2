import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProductsDbService } from '../../core/services/products-db.service';
import { CategoriesDbService } from '../../core/services/categories-db.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  loading = true;
  saving = false;

  error = '';
  success = '';

  products: Product[] = [];
  categories: Category[] = [];

  editId: string | null = null;

  // ✅ nonNullable => nu mai apar string | null / number | null
  form = this.createForm();

  constructor(
    private fb: FormBuilder,
    private productsDb: ProductsDbService,
    private categoriesDb: CategoriesDbService
  ) {}

  private createForm() {
    return this.fb.nonNullable.group({
      name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
      price: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
      description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
      image_url: this.fb.nonNullable.control('', [Validators.required]),
      category_id: this.fb.nonNullable.control('', [Validators.required])
    });
  }

  async ngOnInit(): Promise<void> {
    await this.reload();
    this.startAdd(); // setează form-ul pe modul Add după încărcare
  }

  private clearMessages() {
    this.error = '';
    this.success = '';
  }

  async reload(): Promise<void> {
    try {
      this.loading = true;
      this.clearMessages();

      const [products, categories] = await Promise.all([
        this.productsDb.getAll(),
        this.categoriesDb.getAll()
      ]);

      this.products = products;
      this.categories = categories;

      // dacă nu există categorie selectată, alegem prima
      if (!this.form.controls.category_id.value && this.categories.length > 0) {
        this.form.controls.category_id.setValue(this.categories[0].id);
      }
    } catch (e: any) {
      this.error = e?.message ?? 'Eroare la încărcare.';
    } finally {
      this.loading = false;
    }
  }

  startAdd(): void {
    this.editId = null;
    this.clearMessages();

    this.form.reset({
      name: '',
      price: 0,
      description: '',
      image_url: '',
      category_id: this.categories[0]?.id ?? ''
    });
  }

  startEdit(p: Product): void {
    this.editId = p.id;
    this.clearMessages();

    this.form.setValue({
      name: p.name,
      price: Number(p.price),
      description: p.description,
      image_url: p.image_url,
      category_id: p.category_id
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async save(): Promise<void> {
    this.clearMessages();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Formular invalid. Verifică câmpurile.';
      return;
    }

    const payload = this.form.getRawValue(); // ✅ tipuri fără null

    try {
      this.saving = true;

      if (this.editId) {
        await this.productsDb.update(this.editId, payload);
        this.success = 'Produs actualizat cu succes ✅';
      } else {
        await this.productsDb.add(payload);
        this.success = 'Produs adăugat cu succes ✅';
      }

      await this.reload();
      this.startAdd();
    } catch (e: any) {
      this.error = e?.message ?? 'Eroare la salvare.';
    } finally {
      this.saving = false;
    }
  }

  async remove(id: string): Promise<void> {
    this.clearMessages();

    const ok = confirm('Sigur ștergi acest produs?');
    if (!ok) return;

    try {
      this.saving = true;
      await this.productsDb.remove(id);
      this.success = 'Produs șters ✅';

      await this.reload();
      if (this.editId === id) {
        this.startAdd();
      }
    } catch (e: any) {
      this.error = e?.message ?? 'Eroare la ștergere.';
    } finally {
      this.saving = false;
    }
  }

  // Optional: helper pentru template
  get f() {
    return this.form.controls;
  }
}
