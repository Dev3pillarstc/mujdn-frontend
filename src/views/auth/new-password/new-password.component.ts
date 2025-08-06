import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CustomValidators } from '@/validators/custom-validators';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { NewPasswordModel } from '@/models/features/password-reset/new-password-model';
import { ResetPasswordService } from '@/services/features/reset-password.service';
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
  // Dependencies
  private readonly fb = inject(FormBuilder);
  private readonly resetPasswordService = inject(ResetPasswordService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly alertService = inject(AlertService);
  private readonly destroy$ = new Subject<void>();

  // Form
  newPasswordForm!: FormGroup;

  // State flags
  isVerifying = true;
  isValidToken = false;

  // Data
  errorMessage = '';
  userId = '';
  token = '';

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupRouteParametersSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Form initialization
  private initializeForm(): void {
    this.newPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, CustomValidators.strongPassword()]],
        confirmPassword: ['', [Validators.required, CustomValidators.strongPassword()]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Route parameters handling
  private setupRouteParametersSubscription(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.extractRouteParameters(params);
      this.validateAndVerifyToken();
    });
  }

  private extractRouteParameters(params: any): void {
    this.userId = params['userId'];
    this.token = params['token'];
  }

  private validateAndVerifyToken(): void {
    if (!this.areRequiredParametersPresent()) {
      this.handleMissingParameters();
      return;
    }

    this.verifyResetToken();
  }

  private areRequiredParametersPresent(): boolean {
    return !!this.userId && !!this.token;
  }

  private handleMissingParameters(): void {
    this.errorMessage = 'Invalid reset link. Missing required parameters.';
    this.isVerifying = false;
    this.isValidToken = false;
  }

  // Token verification
  private verifyResetToken(): void {
    this.isVerifying = true;

    this.resetPasswordService
      .verifyResetPassword(this.userId, encodeURIComponent(this.token))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleTokenVerificationSuccess(),
        // error: (error) => this.handleTokenVerificationError(error),
      });
  }

  private handleTokenVerificationSuccess(): void {
    this.isVerifying = false;
    this.isValidToken = true;
    this.errorMessage = '';
  }

  private handleTokenVerificationError(error: any): void {
    console.error('Token verification failed:', error);
    this.isVerifying = false;
    this.isValidToken = false;
    this.errorMessage = error.error?.message || 'Invalid or expired reset link.';
  }

  // Form submission
  onSubmit(): void {
    if (!this.newPasswordForm.valid || !this.isValidToken) {
      this.markFormFieldsAsTouched();
      return;
    }

    const formData = this.getFormData();
    this.updatePassword(formData);
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.newPasswordForm.controls).forEach((key) => {
      this.newPasswordForm.get(key)?.markAsTouched();
    });
  }

  private getFormData(): NewPasswordModel {
    return {
      userId: this.userId,
      token: this.token,
      newPassword: this.newPasswordForm.get('newPassword')?.value,
      confirmPassword: this.newPasswordForm.get('confirmPassword')?.value,
    };
  }

  private updatePassword(formData: NewPasswordModel): void {
    this.resetPasswordService
      .updatePassword(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handlePasswordUpdateSuccess(),
        // error: (error) => this.handlePasswordUpdateError(error),
      });
  }

  private handlePasswordUpdateSuccess(): void {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);

    this.router.navigate(['/auth/login'], {
      queryParams: { message: 'password_reset_success' },
    });
  }

  private handlePasswordUpdateError(error: any): void {
    console.error('Password reset failed:', error);
    this.errorMessage = error.error?.message || 'Password reset failed. Please try again.';
  }

  // Navigation
  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Form control getters
  get newPasswordControl(): AbstractControl {
    return this.newPasswordForm.get('newPassword')!;
  }

  get confirmPasswordControl(): AbstractControl {
    return this.newPasswordForm.get('confirmPassword')!;
  }
}
