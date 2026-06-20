import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../../features/Auth/services/auth.service';
import { ProfileDropdownComponent } from '../../../general/profile-dropdown/profile-dropdown.component';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule,ProfileDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private router: Router) {}
  private readonly authService = inject(AuthService);
  get isloggedIn (){
    return this.authService.isLoggedIn();
  }


   goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
