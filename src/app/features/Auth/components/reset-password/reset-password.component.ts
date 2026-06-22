import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { matchPasswordValidator } from '../../../../shared/confirm-password-validator';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { AuthLayoutComponent } from '../../../../shared/layouts/auth-layout/auth-layout.component';
import { AuthHeaderComponent } from "../../../../shared/components/auth/auth-header/auth-header.component";
import { AuthImageSectionComponent } from "../../../../shared/components/auth/auth-image-section/auth-image-section.component";
@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    AuthLayoutComponent,
    AuthHeaderComponent,
    AuthImageSectionComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  userEmail: string | null = localStorage.getItem('userEmail');

  resetForm!: FormGroup;
  loading = signal(false);

  ngOnInit() {
    this.resetForm = this.fb.group(
      {
        email: [this.userEmail, [Validators.required, Validators.email]],
        seed: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: matchPasswordValidator('password', 'confirmPassword') },
    );
  }

  onResetPass() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    console.log(this.resetForm.value);
    this.authService.onResetPass(this.resetForm.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message,
        });
      },
      complete: () => {
        localStorage.removeItem('userEmail');
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
