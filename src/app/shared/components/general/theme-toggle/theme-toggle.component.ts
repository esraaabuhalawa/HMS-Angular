import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);
  isDark: boolean = this.themeService.isDark();

  toggle() {
    this.themeService.toggleTheme();
    this.isDark = this.themeService.isDark();
  }
}
