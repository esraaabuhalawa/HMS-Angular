import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-customers-section',
  imports: [TranslatePipe ],
  templateUrl: './customers-section.component.html',
  styleUrl: './customers-section.component.scss',
})
export class CustomersSectionComponent {
  translate = inject(TranslateService);

 get isArabic() {
    return this.translate.currentLang() === 'ar';
  }

}
