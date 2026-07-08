import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { ICurrentUserResponse } from '../../interfaces/auth';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthHeaderComponent } from '../../../../shared/components/auth/auth-header/auth-header.component';
import { AuthImageSectionComponent } from '../../../../shared/components/auth/auth-image-section/auth-image-section.component';
import { AuthLayoutComponent } from '../../../../shared/layouts/auth-layout/auth-layout.component';

@Component({
  selector: 'app-register',
  imports: [
    AuthLayoutComponent,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    FileUploadModule,
    ToastModule,
    BadgeModule,
    ProgressBarModule,
    AuthHeaderComponent,
    AuthImageSectionComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authservice = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  registerForm!: FormGroup;
  isLoading: boolean = false;
  files: any[] = [];
  constructor() {
    this.formInit();
  }
  ngOnInit(): void {}
  formInit() {
    this.registerForm = this.fb.group(
      {
        userName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
        phoneNumber: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        country: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
          ],
        ],
        profileImage: [null, [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator('password', 'confirmPassword'),
      },
    );
  }
  onRegister() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    let createdUser = new FormData();
    Object.entries(this.registerForm.controls).forEach(([key, control]) => {
      if (key !== 'profileImage') createdUser.append(key, control.value);
    });

    createdUser.append('role', 'user');
    createdUser.append('profileImage', this.files[0]);

    for (const pair of createdUser.entries()) {
      console.log(pair[0], pair[1]);
    }
    this.authservice.register(createdUser).subscribe({
      next: (res: ICurrentUserResponse) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Account Created',
          detail: 'Your account has been created successfully!',
        });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
        this.isLoading = false;
      },
    });
  }
  passwordMatchValidator(pass: string, confirmPass: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(pass)?.value;
      const confirmPassword = control.get(confirmPass)?.value;

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
  get f() {
    return this.registerForm.controls;
  }

  onSelect(event: any) {
    this.files = event.currentFiles;
    if (this.files.length > 0) {
      this.registerForm.get('profileImage')?.setValue(this.files[0]);
    } else {
      this.registerForm.get('profileImage')?.setValue(null);
    }

    this.registerForm.get('profileImage')?.markAsTouched();
  }

  onClear() {
    this.files = [];
    this.registerForm.get('profileImage')?.setValue(null);
    this.registerForm.get('profileImage')?.markAsTouched();
  }
}
