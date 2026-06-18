import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component')
        .then(c => c.HomeComponent),
  },
  {
    path: 'rooms',
    loadChildren: () =>
      import('./modules/rooms/rooms.routes')
        .then(r => r.ROOMS_ROUTES),
  },
];
