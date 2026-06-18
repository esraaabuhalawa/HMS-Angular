import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
