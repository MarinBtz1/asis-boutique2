import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';

import { AuthService, Profile } from '../../core/services/auth.service';
import { supabase } from '../../core/services/supabase.client';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  loading = true;
  isLoggedIn = false;
  isAdmin = false;

  profile: Profile | null = null;

  private unsubscribeAuth?: () => void;

  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.refreshAuthState();

    const { data } = supabase.auth.onAuthStateChange(async () => {
      await this.refreshAuthState();
    });

    this.unsubscribeAuth = () => data.subscription.unsubscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeAuth?.();
  }

  private async refreshAuthState() {
    try {
      this.loading = true;

      const session = await this.auth.getSession();
      this.isLoggedIn = !!session;

      if (session) {
        await this.auth.ensureProfile();
        this.profile = await this.auth.getProfile();
        this.isAdmin = this.profile?.role === 'admin';
      } else {
        this.profile = null;
        this.isAdmin = false;
      }
    } catch {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.profile = null;
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login');
  }
}
