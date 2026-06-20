import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthLayoutComponent } from "../../../../core/layouts/auth-layout/auth-layout.component";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { AuthHeaderComponent } from "../../../../shared/components/auth/auth-header/auth-header.component";
import { AuthImageSectionComponent } from "../../../../shared/components/auth/auth-image-section/auth-image-section.component";
@Component({
  selector: 'app-forgot-password',
  imports: [AuthLayoutComponent, ReactiveFormsModule, InputTextModule, ButtonModule, AuthHeaderComponent, AuthImageSectionComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly messageService = inject(MessageService);
  private readonly authservice = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  forgotForm!: FormGroup;
  isLoading: boolean = false;



  constructor() {
  this.formInit();
}


  formInit(): void {
  this.forgotForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
  });
}

onSubmit(): void {
  if (this.forgotForm.invalid) {
    this.forgotForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  const email = this.forgotForm.value.email;

  this.authservice.forgotPassword(email).subscribe({
    next: (res) => {
      localStorage.setItem('userEmail', email);
      this.router.navigate(['/auth/reset-password']);
      this.isLoading = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Reset link sent successfully'
      });
    },

    error: (err) => {
      this.isLoading = false;

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'Something went wrong'
      });
    }
  });
}

get f() {
  return this.forgotForm.controls;
}




}
