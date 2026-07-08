import { Component, inject, OnInit } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from '../../../Auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-user-profile',
  imports: [SkeletonModule, CommonModule, TranslatePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  private readonly authservice = inject(AuthService);
  userInfo$ = this.authservice.currentUser$;

  loading = false;

  ngOnInit(): void {
    this.authservice.loadCurrentUser();
  }
}
