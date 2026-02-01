import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ItemsService } from './core/services/items.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private items: ItemsService) {}

  async ngOnInit() {
    await this.items.loadOnce(); // ✅ o singură dată
  }
}
