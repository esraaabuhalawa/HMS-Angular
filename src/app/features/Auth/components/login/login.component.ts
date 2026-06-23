import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Component, inject, OnDestroy } from '@angular/core';
import { AuthLayoutComponent } from '../../../../shared/layouts/auth-layout/auth-layout.component';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  GoogleLoginProvider,
  GoogleSigninButtonDirective,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { RoleEnum } from '../../../../core/enums/role.enum';
import { AuthHeaderComponent } from "../../../../shared/components/auth/auth-header/auth-header.component";
import { AuthImageSectionComponent } from "../../../../shared/components/auth/auth-image-section/auth-image-section.component";
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  imports: [
    AuthLayoutComponent,
    ReactiveFormsModule,
    GoogleSigninButtonDirective,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    RouterLink,
    AuthHeaderComponent,
    AuthImageSectionComponent,
    TranslatePipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private readonly messageService = inject(MessageService);
  private formSub = new Subscription();
  private readonly fb = inject(FormBuilder);
  private readonly socialAuthService = inject(SocialAuthService);
  private readonly authservice = inject(AuthService);
  private readonly router = inject(Router);
  private authSub?: Subscription;
  loginForm!: FormGroup;
  isLoading: boolean = false;
  user: SocialUser | null = null;

  constructor() {
    this.formInit();
  }


  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authSub = this.socialAuthService.authState.subscribe((user: SocialUser) => {
      console.log('Auth state changed:', user);
      this.user = user;
      if (user.idToken) {
        this.authservice.loginWithGoogle(user.idToken);
      } else {
        console.warn('SocialUser has no idToken — check Google config');
      }
    });
  }

  // Forms Functions
  formInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/),
        ],
      ],
    });
  }
  // API Functions
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    // start loader
    this.isLoading = true;

    this.formSub = this.authservice.onLogin(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('HMSToken', res.data.token);
        this.authservice.loadCurrentUser();

        this.router.navigate(['/']);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have been logged in successfully!',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // Manual Google sign-in method
  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // // Sign out method
  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }

  // Life Cycle Hooks
  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.formSub.unsubscribe();
  }

  get f() {
    return this.loginForm.controls;
  }
}
