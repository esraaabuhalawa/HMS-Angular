import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../../features/Auth/services/auth.service';
import { ProfileDropdownComponent } from '../../../general/profile-dropdown/profile-dropdown.component';
import { LanguageSwitcherComponent } from "../../../general/language-switcher/language-switcher.component";
import { TranslatePipe } from '@ngx-translate/core';
import { RoleEnum } from '../../../../../core/enums/role.enum';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule , ProfileDropdownComponent, RouterLink, LanguageSwitcherComponent , TranslatePipe, RouterLinkActive,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  isSidebarOpen = false;

  get isloggedIn() {
    return this.authService.isLoggedIn();
  }
}
