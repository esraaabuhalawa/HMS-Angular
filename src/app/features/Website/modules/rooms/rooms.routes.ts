import { Routes } from '@angular/router';

export const ROOMS_ROUTES: Routes = [
  {
    path: '',
    title: 'Explore Rooms',
    loadComponent: () =>
      import('./components/rooms-list/rooms-list.component')
        .then(c => c.RoomsListComponent),
  },
  {
    path: ':id',
    title: 'Room Details',
    loadComponent: () =>
      import('./components/room-details/room-details.component')
        .then(c => c.RoomDetailsComponent),
  },
];
