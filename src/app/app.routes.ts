import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { userGuard } from './core/guards/user-guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/website-layout/website-layout.component').then(
        (c) => c.WebsiteLayoutComponent,
      ),

    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/Website/website.routes').then((r) => r.WEBSITE_ROUTES),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/Auth/auth.routes').then((r) => r.Auth_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [adminGuard],

    loadComponent: () =>
      import('./shared/layouts/dashboard-layout/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent,
      ),

    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/Dashboard/dashboard.routes').then((r) => r.DASHBOARD_ROUTES),
      },
    ],
  },
  {
    path: 'payment/:bookingId',
    canActivate: [userGuard],
    title: 'Payment',
    loadComponent: () =>
      import('../app/features/Website/modules/rooms/components/payment/payment.component').then(
        (c) => c.PaymentComponent,
      ),
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('./shared/components/general/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
