import { InputTextModule } from 'primeng/inputtext';
import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
  declare loginForm: FormGroup;
  errorMessage: string | null = null;
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  ngOnInit() {
    this.buildForm();
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  buildForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    this.errorMessage = null;

    this.authService.login(username, password).subscribe((result) => {});
  }
}
