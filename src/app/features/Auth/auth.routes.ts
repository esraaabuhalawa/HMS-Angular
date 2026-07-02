import { Routes } from '@angular/router';

export const Auth_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
        .then(c => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component')
        .then(c => c.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password.component')
        .then(c => c.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component')
        .then(c => c.ResetPasswordComponent),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./components/change-password/change-password.component')
        .then(c => c.ChangePasswordComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
