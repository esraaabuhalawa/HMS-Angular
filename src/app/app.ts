import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { AuthService } from './features/Auth/services/auth.service';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('HMS-angular');
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);


  ngOnInit() {
    this.languageService.initializeLanguage();
    this.authService.loadCurrentUser();
  }
}
