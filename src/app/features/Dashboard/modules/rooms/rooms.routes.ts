import { Routes } from '@angular/router';

export const ROOMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/room-list/room-list.component')
        .then(c => c.RoomListComponent),
  },

  {
    path: 'add',
    loadComponent: () =>
      import('./components/add-edit/add-edit.component')
        .then(c => c.AddEditComponent),
  },

    {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/add-edit/add-edit.component')
        .then(c => c.AddEditComponent),
  },

  // {
  //   path: ':id',
  //   loadComponent: () =>
  //     import('./pages/room-details/room-details.component')
  //       .then(c => c.RoomDetailsComponent),
  // },

];
