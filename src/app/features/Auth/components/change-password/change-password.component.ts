import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { matchPasswordValidator } from '../../../../shared/validators/confirm-password-validator';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { AuthLayoutComponent } from '../../../../shared/layouts/auth-layout/auth-layout.component';
import { AuthHeaderComponent } from '../../../../shared/components/auth/auth-header/auth-header.component';
import { AuthImageSectionComponent } from '../../../../shared/components/auth/auth-image-section/auth-image-section.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    AuthLayoutComponent,
    AuthHeaderComponent,
    AuthImageSectionComponent,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);

  userEmail: string | null = localStorage.getItem('userEmail');

  changePasswordForm!: FormGroup;
  loading = signal(false);

  ngOnInit() {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: [
          '', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,),
          ],
        ],
        newPassword: [
          '', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: matchPasswordValidator('newPassword', 'confirmPassword') },
    );
  }

  onResetPass() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.authService.changePassword(this.changePasswordForm.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('COMMON.SUCCESS'),
          detail: res.message,
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: err.error?.message ?? this.translate.instant('COMMON.SOMETHING_WENT_WRONG'),
        });
      },
      complete: () => {
        this.router.navigate(['/']);
      },
    });
  }
  get f() {
    return this.changePasswordForm.controls;
  }
}
