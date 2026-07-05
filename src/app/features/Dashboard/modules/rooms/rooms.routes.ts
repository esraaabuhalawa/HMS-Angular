import { Routes } from '@angular/router';

export const ROOMS_ROUTES: Routes = [
  {
    path: '',
    title: 'Rooms',
    loadComponent: () =>
      import('./components/room-list/room-list.component').then(
        (c) => c.RoomListComponent
      ),
  },

  {
    path: 'add',
    title: 'Add Room',
    loadComponent: () =>
      import('./components/add-edit/add-edit.component').then(
        (c) => c.AddEditComponent
      ),
  },

  {
    path: 'edit/:id',
    title: 'Edit Room',
    loadComponent: () =>
      import('./components/add-edit/add-edit.component').then(
        (c) => c.AddEditComponent
      ),
  },

  {
    path: 'view/:id',
    title: 'View Room',
    loadComponent: () =>
      import('./components/view/view.component').then(
        (c) => c.ViewComponent
      ),
  },
];
