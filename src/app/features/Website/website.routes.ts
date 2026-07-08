import { Routes } from '@angular/router';
import { userGuard } from '../../core/guards/user-guard';

export const WEBSITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'rooms',
    loadChildren: () => import('./modules/rooms/rooms.routes').then((r) => r.ROOMS_ROUTES),
  },
  {
    path: 'favorites',
    canActivate: [userGuard],
    title: 'Favorites',
    loadComponent: () =>
      import('./modules/favorites/components/favorites-list/favorites-list.component')
        .then(c => c.FavoritesListComponent),
  },

  // {
  //   path: 'Checkout',
  //   canActivate: [userGuard],
  //   title: 'Checkout',
  //   loadComponent: () =>
  //     import('./modules/favorites/components/favorites/favorites.component')
  //       .then(c => c.CheckoutComponent),
  // }
];
