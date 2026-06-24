import { Component, inject } from '@angular/core';
import { NavbarUiServiceService } from '../../../../../core/services/navbar-ui-service.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
interface Menu {
  label: string,
  icon: string,
  routerNavigate: string,
}
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly navbarUiService = inject(NavbarUiServiceService);

  isMobileOpen$ = this.navbarUiService.isMobileOpen$;
  isMobile$ = this.navbarUiService.isMobile$;

  navMenu: Menu[] = [
    {
      label: 'Home',
      icon: 'fa fa-home',
      routerNavigate: '/dashboard',
    },
    {
      label: 'Rooms',
      icon: 'fa-solid fa-user-group',
      routerNavigate: '/dashboard/rooms',
    },
    {
      label: 'Facilities',
      icon: 'fa-solid fa-border-all',
      routerNavigate: '/dashboard',
    },
    {
      label: 'Home',
      icon: 'fa fa-home',
      routerNavigate: '/dashboard',
    },
    {
      label: 'Home',
      icon: 'fa fa-home',
      routerNavigate: '/dashboard',
    },
  ];


  toggleSidebar() {
    this.navbarUiService.toggleSidebar();
  }

  onNavItemClick(): void {
    if (window.innerWidth <= 992) {
      this.navbarUiService.closeMobileMenu();
    }
  }

}
