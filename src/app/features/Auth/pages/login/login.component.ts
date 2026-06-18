import { Component } from '@angular/core';
import { AuthLayoutComponent } from "../../../../core/layouts/auth-layout/auth-layout.component";

@Component({
  selector: 'app-login',
  imports: [AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
