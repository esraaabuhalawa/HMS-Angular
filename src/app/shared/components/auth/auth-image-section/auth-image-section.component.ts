import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-image-section',
  imports: [],
  templateUrl: './auth-image-section.component.html',
  styleUrl: './auth-image-section.component.scss',
})
export class AuthImageSectionComponent {
  @Input() imageSrc = '/images/login.png';
  @Input() imageAlt = '';
  @Input() title = '';
  @Input() subtitle = '';
}
