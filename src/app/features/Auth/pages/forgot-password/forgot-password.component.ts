import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthLayoutComponent } from "../../../../core/layouts/auth-layout/auth-layout.component";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
@Component({
  selector: 'app-forgot-password',
  imports: [AuthLayoutComponent,ReactiveFormsModule,RouterLink ,InputTextModule,ButtonModule],
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

  const email = this.forgotForm.value.email;

  localStorage.setItem('userEmail', email);

  this.router.navigate(['/auth/reset-password']);



  this.isLoading = true;
}

get f() {
  return this.forgotForm.controls;
}




}
