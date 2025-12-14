import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading = false;
  error = '';
  success = '';

  form = this.createForm();

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  private createForm() {
    return this.fb.nonNullable.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)])
    });
  }

  async login() {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.loading = true;
      const { email, password } = this.form.getRawValue();

      // ✅ login + ensureProfile (se face deja în auth.service.ts)
      await this.auth.signIn(email, password);

      // verifică rolul
      const isAdmin = await this.auth.isAdmin();
      if (!isAdmin) {
        this.error = 'Nu ai rol de administrator. Setează role=admin în Supabase (profiles).';
        return;
      }

      this.success = 'Logare reușită ✅';
      await this.router.navigateByUrl('/admin');
    } catch (e: any) {
      this.error = e?.message ?? 'Eroare la logare.';
    } finally {
      this.loading = false;
    }
  }

  // opțional: buton de creare cont (dacă vrei signup)
  async signup() {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.loading = true;
      const { email, password } = this.form.getRawValue();

      await this.auth.signUp(email, password);
      this.success = 'Cont creat. Acum poți face login (dacă nu cere confirmare email). ✅';
    } catch (e: any) {
      this.error = e?.message ?? 'Eroare la înregistrare.';
    } finally {
      this.loading = false;
    }
  }
}
