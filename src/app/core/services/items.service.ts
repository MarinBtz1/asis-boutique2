import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private readonly _items$ = new BehaviorSubject<Item[]>([]);
  readonly items$ = this._items$.asObservable();

  private loaded = false;

  constructor(private http: HttpClient) {}

  async loadOnce(): Promise<void> {
    if (this.loaded) return;
    this.loaded = true;

    const items = await firstValueFrom(
      this.http.get<Item[]>('assets/items.json')
    );

    this._items$.next(items ?? []);
  }

  getById(id: string): Item | undefined {
    return this._items$.value.find(x => x.id === id);
  }

  getCategories(): string[] {
    return Array.from(new Set(this._items$.value.map(x => x.category))).sort();
  }
}
