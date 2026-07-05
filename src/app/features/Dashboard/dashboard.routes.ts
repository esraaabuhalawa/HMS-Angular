import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'rooms',
    loadChildren: () => import('./modules/rooms/rooms.routes').then((r) => r.ROOMS_ROUTES),
  },
  {
    path: 'ads',
    title: 'Ads',
    loadComponent: () =>
      import('./modules/Ads/components/ads-list/ads-list.component').then(
        (c) => c.AdsListComponent,
      ),
  },
  {
    path: 'facilities',
    title: 'Facilities',
    loadComponent: () =>
      import('./modules/facilities/components/facility-list/facility-list.component').then(
        (c) => c.FacilityListComponent,
      ),
  },
  {
    path: 'users',
    title: 'Users',
    loadComponent: () =>
      import('./modules/users/components/user-list/user-list.component').then(
        (c) => c.UserListComponent,
      ),
  },
  {
    path: 'bookings',
    title: 'Bookings',
    loadComponent: () =>
      import('./modules/booking/components/list-booking/list-booking.component')
        .then(c => c.ListBookingComponent),
  },
];
