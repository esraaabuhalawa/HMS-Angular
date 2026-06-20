// features/rooms/rooms.routes.ts

import { Routes } from '@angular/router';

export const ROOMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/room-list/room-list.component')
        .then(c => c.RoomListComponent),
  },

  // {
  //   path: 'create',
  //   loadComponent: () =>
  //     import('./pages/room-create/room-create.component')
  //       .then(c => c.RoomCreateComponent),
  // },

  // {
  //   path: ':id',
  //   loadComponent: () =>
  //     import('./pages/room-details/room-details.component')
  //       .then(c => c.RoomDetailsComponent),
  // },

  // {
  //   path: 'edit/:id',
  //   loadComponent: () =>
  //     import('./pages/room-edit/room-edit.component')
  //       .then(c => c.RoomEditComponent),
  // },
];
