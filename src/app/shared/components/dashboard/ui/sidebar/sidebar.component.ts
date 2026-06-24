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
      icon: 'pi pi-home',
      routerNavigate: '/dashboard',
    },
    {
      label: 'SIDEBAR.USERS',
      icon: 'pi pi-users',
      routerNavigate: '/dashboard/users',
    },
    {
      label: 'SIDEBAR.ROOMS',
      icon: 'pi pi-th-large',
      routerNavigate: '/dashboard/rooms',
    },
    {
      label: 'SIDEBAR.ADS',
      icon: 'pi pi-megaphone',
      routerNavigate: '/dashboard/ads',
    },
    {
      label: 'SIDEBAR.BOOKINGS',
      icon: 'pi pi-calendar',
      routerNavigate: '/dashboard/bookings',
    },
    {
      label: 'SIDEBAR.FACILITIES',
      icon: 'pi pi-building',
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
