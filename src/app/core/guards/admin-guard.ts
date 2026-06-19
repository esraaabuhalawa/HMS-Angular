import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/Auth/services/auth.service';
import { inject } from '@angular/core';
import { RoleEnum } from '../enums/role.enum';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userRole = authService.getRole();

  if (userRole == RoleEnum.Admin) {
    return true;
  }

  return false;
};
