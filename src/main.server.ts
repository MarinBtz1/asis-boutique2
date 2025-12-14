import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

export default function bootstrap() {
  return bootstrapApplication(AppComponent, {
    providers: [provideServerRendering(), provideRouter(routes)]
  });
}
 