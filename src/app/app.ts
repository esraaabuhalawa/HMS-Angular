import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { AuthService } from './features/Auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('HMS-angular');
  private readonly authService = inject(AuthService);
  ngOnInit() {
    this.authService.loadCurrentUser();
  }
}
