import { Component, inject, OnDestroy } from '@angular/core';
import { AuthLayoutComponent } from "../../../../core/layouts/auth-layout/auth-layout.component";
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [AuthLayoutComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private readonly messageService = inject(MessageService);
  private formSub = new Subscription();
  private readonly fb = inject(FormBuilder);

  private readonly authservice = inject(AuthService);
  private readonly router = inject(Router);
  loginForm!: FormGroup;
  hide = true;
  // Variables
  isLoading: boolean = false;

  // Constructor
  constructor() {
    this.formInit();
  }

  // Life Cycle Hooks
  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  // Forms Functions
  formInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/,
          ),
        ],
      ],
    });
  }
  // API Functions
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }
    // start loader
    this.isLoading = true;

    this.formSub = this.authservice.onLogin(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('HMSToken', res.data.token);
        this.authservice.getProfile();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have been logged in successfully!'
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message
        });
        this.isLoading = false;
      },
      complete: () => {
        this.router.navigate(['/admin']);
        this.isLoading = false;
      },
    });
  }
  get f() {
    return this.loginForm.controls;
  }
}
