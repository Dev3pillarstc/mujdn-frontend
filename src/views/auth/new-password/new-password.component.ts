import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { Password } from 'primeng/password';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { NewPasswordModel } from '@/models/features/password-reset/new-password-model';
import { Subject, takeUntil } from 'rxjs';
import { ResetPasswordService } from '@/services/features/reset-password.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '@/services/shared/alert.service';

@Component({
  selector: 'app-new-password',
  imports: [
    CommonModule,
    InputTextModule,
    TranslatePipe,
    Password,
    ValidationMessagesComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export default class NewPasswordComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private resetPasswordService = inject(ResetPasswordService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  newPasswordForm: FormGroup;
  isVerifying = true;
  isValidToken = false;
  errorMessage = '';
  userId = '';
  token = '';

  constructor() {
    this.newPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, CustomValidators.strongPassword()]],
        confirmPassword: ['', [Validators.required, CustomValidators.strongPassword()]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    // Get userId and token from URL parameters
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params['userId'];
      this.token = params['token'];

      if (!this.userId || !this.token) {
        this.errorMessage = 'Invalid reset link. Missing required parameters.';
        this.isVerifying = false;
        this.isValidToken = false;
        return;
      }

      this.verifyResetToken();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private verifyResetToken() {
    this.isVerifying = true;
    this.resetPasswordService
      .verifyResetPassword(this.userId, encodeURIComponent(this.token))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isVerifying = false;
          this.isValidToken = true;
          this.errorMessage = '';
        },
        error: (error) => {
          this.isVerifying = false;
          this.isValidToken = false;
          this.errorMessage = error.error?.message || 'Invalid or expired reset link.';
          console.error('Token verification failed:', error);
        },
      });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.newPasswordForm.valid && this.isValidToken) {
      const formData: NewPasswordModel = {
        userId: this.userId,
        token: this.token,
        newPassword: this.newPasswordForm.get('newPassword')?.value,
        confirmPassword: this.newPasswordForm.get('confirmPassword')?.value,
      };

      this.resetPasswordService
        .updatePassword(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
            this.alertService.showSuccessMessage(successObject);
            // Navigate to success page or login
            this.router.navigate(['/auth/login'], {
              queryParams: { message: 'password_reset_success' },
            });
          },
          error: (error) => {
            console.error('Password reset failed:', error);
            this.errorMessage = error.error?.message || 'Password reset failed. Please try again.';
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.newPasswordForm.controls).forEach((key) => {
        this.newPasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }

  get newPasswordControl() {
    return this.newPasswordForm.get('newPassword')!;
  }

  get confirmPasswordControl() {
    return this.newPasswordForm.get('confirmPassword')!;
  }
}
