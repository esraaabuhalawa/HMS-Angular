import { Component, inject,  signal } from '@angular/core';
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
import { FormFieldComponent } from '../../../../shared/components/auth/form-field/form-field.component';

@Component({
  selector: 'app-change-password',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    ButtonModule,
    AuthLayoutComponent,
    FormFieldComponent,
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
  get form() {
    return this.changePasswordForm.controls;
  }
}
