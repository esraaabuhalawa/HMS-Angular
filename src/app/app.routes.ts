import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/website-layout/website-layout.component')
        .then(c => c.WebsiteLayoutComponent),

    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/Website/website.routes')
            .then(r => r.WEBSITE_ROUTES),
      },
    ],
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/Auth/auth.routes')
        .then(r => r.Auth_ROUTES),
  },

  {
    path: 'admin',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./core/layouts/dashboard-layout/dashboard-layout.component')
        .then(c => c.DashboardLayoutComponent),

    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/Dashboard/dashboard.routes')
            .then(r => r.DASHBOARD_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
