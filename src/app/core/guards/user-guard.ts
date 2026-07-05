import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/Auth/services/auth.service';
import { inject } from '@angular/core';
import { RoleEnum } from '../enums/role.enum';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const translate = inject(TranslateService);

  const userRole = authService.getRole();

  if (userRole === RoleEnum.User) {
    return true;
  }

  messageService.add({
    severity: 'warn',
    summary: translate.instant('AUTH.ACCESS_DENIED'),
    detail: translate.instant('AUTH.LOGIN_AS_USER'),
  });

  return false;
};
