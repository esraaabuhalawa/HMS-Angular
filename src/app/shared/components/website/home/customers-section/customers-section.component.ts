import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';



@Component({
  selector: 'app-customers-section',
  imports: [TranslatePipe ],
  templateUrl: './customers-section.component.html',
  styleUrl: './customers-section.component.scss',
})
export class CustomersSectionComponent {}
