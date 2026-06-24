import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';

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
    path: 'admin',
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
  path: '**',
  loadComponent: () =>
    import('./shared/components/general/not-found/not-found.component').then(
      m => m.NotFoundComponent
    ),
}
];
