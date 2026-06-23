import { Component,} from '@angular/core';
import { ProfileDropdownComponent } from '../../../general/profile-dropdown/profile-dropdown.component';
import { LanguageSwitcherComponent } from "../../../general/language-switcher/language-switcher.component";

@Component({
  selector: 'app-header',
  imports: [ProfileDropdownComponent, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

}
