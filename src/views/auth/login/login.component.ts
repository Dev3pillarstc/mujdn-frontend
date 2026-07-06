import { InputTextModule } from 'primeng/inputtext';
import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@/services/auth/auth.service';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { PasswordModule } from 'primeng/password';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';

enum LoginMode {
  SYSTEM = 'system',
  ACTIVE_DIRECTORY = 'activeDirectory',
}

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    TranslatePipe,
    ReactiveFormsModule,
    PasswordModule,
    ValidationMessagesComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
  declare loginForm: FormGroup;
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  selectedLoginMode: LoginMode = LoginMode.SYSTEM;
  LoginMode = LoginMode;

  get usernameControl() {
    return this.loginForm.get('username') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLoginModeChange(mode: LoginMode) {
    this.selectedLoginMode = mode;
    this.loginForm.reset();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    const loginObservable =
      this.selectedLoginMode === LoginMode.ACTIVE_DIRECTORY
        ? this.authService.loginWithActiveDirectory(username, password)
        : this.authService.login(username, password);

    loginObservable.subscribe((result) => {
      if (!result.error) {
        this.authService
          .getUser()
          .pipe(
            filter((user) => !!user),
            take(1)
          )
          .subscribe(() => {
            this.authService.hasVisitsAccess && this.router.navigate(['auth/choose-system']) ||
              this.router.navigate(['/attendance/home']);
          });
      }
    });
  }

  onForgotPassword() {
    this.router.navigate(['auth/forget-password']);
  }
}
