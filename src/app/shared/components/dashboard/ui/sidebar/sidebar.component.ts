import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NavbarService } from '../../../../../core/services/navbar.service';
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
  readonly navbarService = inject(NavbarService);

  isMobileOpen$ = this.navbarService.isMobileOpen$;
  isMobile$ = this.navbarService.isMobile$;

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
    this.navbarService.toggleSidebar();
  }

  onNavItemClick(): void {
    if (window.innerWidth <= 992) {
      this.navbarService.closeMobileMenu();
    }
  }

}
