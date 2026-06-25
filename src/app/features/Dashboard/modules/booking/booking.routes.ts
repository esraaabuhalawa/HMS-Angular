import { Routes } from '@angular/router';

export const BOOKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/list-booking/list-booking.component')
        .then(c => c.ListBookingComponent),
  },
];
