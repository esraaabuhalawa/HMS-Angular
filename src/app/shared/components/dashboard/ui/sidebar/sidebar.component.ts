import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NavbarUiService } from '../../../../../core/services/navbar-ui.service';
interface Menu {
  label: string,
  icon: string,
  routerNavigate: string,
}
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, AsyncPipe, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly navbarUiService = inject(NavbarUiService);

  isMobileOpen$ = this.navbarUiService.isMobileOpen$;
  isMobile$ = this.navbarUiService.isMobile$;

  navMenu: Menu[] = [
    {
      label: 'SIDEBAR.HOME',
      icon: 'fa fa-home',
      routerNavigate: '/dashboard',
    },
    {
      label: 'SIDEBAR.USERS',
      icon: 'fa-solid fa-user-group',
      routerNavigate: '/dashboard/users',
    },
    {
      label: 'SIDEBAR.ROOMS',
      icon: 'fa-solid fa-border-all',
      routerNavigate: '/dashboard/rooms',
    },
    {
      label: 'SIDEBAR.ADS',
      icon: 'fa-solid fa-bullhorn',
      routerNavigate: '/dashboard/ads',
    },
    {
      label: 'SIDEBAR.BOOKINGS',
      icon: 'fa-solid fa-calendar-check',
      routerNavigate: '/dashboard/bookings',
    },
    {
      label: 'SIDEBAR.FACILITIES',
      icon: 'fa-solid fa-building',
      routerNavigate: '/dashboard/facilities',
    }
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
