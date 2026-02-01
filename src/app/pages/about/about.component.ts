import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [CommonModule, FormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  sent = false;

  form = {
    name: '',
    email: '',
    message: ''
  };

  submit() {
    // demo: doar afișăm un mesaj, poți conecta la Supabase mai târziu
    console.log('Contact form:', this.form);
    this.sent = true;

    setTimeout(() => (this.sent = false), 2500);
    this.form = { name: '', email: '', message: '' };
  }
}
