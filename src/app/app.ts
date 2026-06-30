import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { AuthService } from './features/Auth/services/auth.service';
import { LanguageService } from './core/services/language.service';
import { FavoritesService } from './features/Website/modules/favorites/services/favorites.service';

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
  private readonly favoritesService = inject(FavoritesService)

  ngOnInit() {
    this.languageService.initializeLanguage();
    this.authService.loadCurrentUser();
    if(this.authService.isLoggedIn()){
      this.favoritesService.loadFavorites();
    }
  }
}
