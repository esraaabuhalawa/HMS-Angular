import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/Auth/services/auth.service';
import { inject } from '@angular/core';
import { RoleEnum } from '../enums/role.enum';

export const adminGuard: CanActivateFn = (route, state) => {
  return true;
};
