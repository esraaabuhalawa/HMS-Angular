import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { Skeleton } from 'primeng/skeleton';
import { Popover } from 'primeng/popover';
import { RoleEnum } from '../../../../core/enums/role.enum';
import { ICurrentUser } from '../../../../features/Auth/interfaces/auth';
import { AuthService } from '../../../../features/Auth/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-profile-dropdown',
  imports: [AsyncPipe, RouterLink, Popover, Skeleton,TranslatePipe],
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.scss',
})
export class ProfileDropdownComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router)
  currentUser!: ICurrentUser | null;
  currentUser$ = this.authService.currentUser$;

  logout() {
    this.authService.logout();
    if (this.isAdmin) {
      this.router.navigate(['/auth/login']);
    }
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === RoleEnum.Admin
  }

  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/images/user-placeholder.png';
  }
}
