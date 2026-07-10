import { Component, inject, } from '@angular/core';
import { ProfileDropdownComponent } from '../../../general/profile-dropdown/profile-dropdown.component';
import { LanguageSwitcherComponent } from "../../../general/language-switcher/language-switcher.component";
import { TranslatePipe } from '@ngx-translate/core';
import { NavbarService } from '../../../../../core/services/navbar.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ProfileDropdownComponent, LanguageSwitcherComponent, TranslatePipe, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly navbarService = inject(NavbarService);
  isMobile$ = this.navbarService.isMobile$;
  toggleSidebar() {
    this.navbarService.toggleSidebar();
  }

}
