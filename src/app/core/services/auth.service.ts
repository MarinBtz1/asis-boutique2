import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

export type Role = 'admin' | 'user';

export type Profile = {
  id: string;
  email: string | null;
  role: Role;
  created_at?: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Login cu email/parolă */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // ✅ după login -> asigură profil în DB
    await this.ensureProfile();

    return data;
  }

  /** (Opțional) Înregistrare + login automat */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // uneori supabase cere confirmare email -> user poate fi null
    // dar încercăm totuși să creăm profil dacă există user/session
    await this.ensureProfile().catch(() => {});

    return data;
  }

  /** Logout */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /** Session curentă */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  /** User curent (din auth) */
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  /**
   * ✅ Creează profil în DB dacă lipsește
   * Tabel: public.profiles (id uuid PK -> auth.users.id)
   */
  async ensureProfile(): Promise<Profile> {
    const user = await this.getUser();
    if (!user) throw new Error('Nu există utilizator logat.');

    // 1) încearcă să citească profilul
    const { data: existing, error: selErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (selErr) throw selErr;

    if (existing) return existing as Profile;

    // 2) dacă nu există -> îl creează
    const payload: Profile = {
      id: user.id,
      email: user.email ?? null,
      role: 'user'
    };

    const { data: inserted, error: insErr } = await supabase
      .from('profiles')
      .insert(payload)
      .select('*')
      .single();

    if (insErr) throw insErr;
    return inserted as Profile;
  }

  /** Citește profilul din DB (sau null dacă nu e logat) */
  async getProfile(): Promise<Profile | null> {
    const session = await this.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) throw error;
    return (data as Profile) ?? null;
  }

  /** True/False dacă user-ul e admin */
  async isAdmin(): Promise<boolean> {
    const profile = await this.getProfile();
    return profile?.role === 'admin';
  }

  /**
   * Setează rolul ADMIN (doar pentru laborator / debug)
   * ⚠️ va funcționa doar dacă ai policy care permite update pe propriul profil
   * Recomandat: setezi admin din SQL Editor, nu din UI.
   */
  async makeMeAdmin(): Promise<void> {
    const user = await this.getUser();
    if (!user) throw new Error('Nu ești logat.');

    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (error) throw error;
  }

  /** Listener pentru schimbări login/logout */
  onAuthStateChange(callback: () => void) {
    return supabase.auth.onAuthStateChange(() => callback());
  }
}
