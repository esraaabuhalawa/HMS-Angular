// app.routes.ts
import { Routes } from '@angular/router';

export const WEBSITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component')
        .then(c => c.HomeComponent),
  },

   {
    path: 'rooms/:id',
    loadComponent: () =>
      import('./modules/rooms/components/room-details/room-details.component')
        .then(c => c.RoomDetailsComponent),
  },
  // {
  //   path: 'about',
  //   loadComponent: () =>
  //     import('./about/about.component')
  //       .then(c => c.AboutComponent),
  // },

  // {
  //   path: 'rooms',
  //   loadComponent: () =>
  //     import('./rooms/rooms.component')
  //       .then(c => c.RoomsComponent),
  // },

  // {
  //   path: 'offers',
  //   loadComponent: () =>
  //     import('./offers/offers.component')
  //       .then(c => c.OffersComponent),
  // },

  // {
  //   path: 'booking',
  //   loadComponent: () =>
  //     import('./booking/booking.component')
  //       .then(c => c.BookingComponent),
  // },

  // {
  //   path: 'contact',
  //   loadComponent: () =>
  //     import('./contact/contact.component')
  //       .then(c => c.ContactComponent),
  // },
];
