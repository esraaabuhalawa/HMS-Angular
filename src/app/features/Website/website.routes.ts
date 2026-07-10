import { Routes } from '@angular/router';
import { userGuard } from '../../core/guards/user-guard';

export const WEBSITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home-user/home-user.component').then((c) => c.HomeUserComponent),
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
      import('./modules/favorites/components/favorites-list/favorites-list.component').then(
        (c) => c.FavoritesListComponent,
      ),
  },
  {
    path: 'profile',
    canActivate: [userGuard],
    title: 'profile',
    loadComponent: () =>
      import('../../shared/components/general/user-profile/user-profile.component').then(
        (c) => c.UserProfileComponent,
      ),
  },
];
