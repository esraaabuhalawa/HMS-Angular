import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CardModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('HMS-angular');
}
