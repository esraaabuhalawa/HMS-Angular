import { Component, inject, signal } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
interface Language {
  label: string;
  value: string;
  flag: string;
}
@Component({
  selector: 'app-language-switcher',
  imports: [ FormsModule, Select,],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);
  selectedLanguage = signal<Language | null>(null);
  languages = signal<Language[]>([
    {
      label: 'English',
      value: 'en',
      flag: '/images/flags/united-states.png'
    },
    {
      label: 'العربية',
      value: 'ar',
      flag: '/images/flags/egypt.png'
    }
  ]);

  ngOnInit() {
    // Set initial selection based on current language
    const currentLang = this.languageService.getCurrentLanguage();
    this.selectedLanguage.set(this.languages().find(l => l.value === currentLang) ?? this.languages()[0]);
  }

  changeLanguage(language: Language) {
    this.selectedLanguage.set(language);
    this.languageService.changeLanguage(language.value);
  }
}
