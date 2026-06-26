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
    path: 'bookings',
    loadChildren: () => import('./modules/booking/booking.routes').then((r) => r.BOOKING_ROUTES),
  },
  {
    path: 'ads',
    loadComponent: () =>
      import('./modules/Ads/components/ads-list/ads-list.component').then(
        (c) => c.AdsListComponent,
      ),
  },
  {
    path: 'facilities',
    loadComponent: () =>
      import('./modules/facilities/components/facility-list/facility-list/facility-list.component').then(
        (c) => c.FacilityListComponent,
      ),
  },
];
