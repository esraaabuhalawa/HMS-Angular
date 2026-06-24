import { Component, inject,} from '@angular/core';
import { ProfileDropdownComponent } from '../../../general/profile-dropdown/profile-dropdown.component';
import { LanguageSwitcherComponent } from "../../../general/language-switcher/language-switcher.component";
import { TranslatePipe } from '@ngx-translate/core';
import { NavbarUiService } from '../../../../../core/services/navbar-ui.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ProfileDropdownComponent, LanguageSwitcherComponent,TranslatePipe,AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly navbarUiService = inject(NavbarUiService);
  isMobile$ = this.navbarUiService.isMobile$;
   toggleSidebar() {
    this.navbarUiService.toggleSidebar();
  }

}
