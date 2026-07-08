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
    path: 'wishlist',
    canActivate: [userGuard],
    title: 'Wishlist',
    loadComponent: () =>
      import('./modules/wishlist/components/wishlist/wishlist.component').then(
        (c) => c.WishlistComponent,
      ),
  },

  // {
  //   path: 'Checkout',
  //   canActivate: [userGuard],
  //   title: 'Checkout',
  //   loadComponent: () =>
  //     import('./modules/wishlist/components/wishlist/wishlist.component')
  //       .then(c => c.CheckoutComponent),
  // }
];
