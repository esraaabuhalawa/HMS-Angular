import { Component,} from '@angular/core';
import { ProfileDropdownComponent } from "../../../profile-dropdown/profile-dropdown.component";

@Component({
  selector: 'app-header',
  imports: [ProfileDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

}
