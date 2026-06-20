import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-header',
  imports: [RouterLink],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss',
})
export class AuthHeaderComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() linkText = '';
  @Input() linkUrl = '';
  @Input() subText = '';
  @Input() linkClass = 'text-red-700';
}
