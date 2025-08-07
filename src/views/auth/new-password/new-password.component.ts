import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
import { PasswordResetResult } from '@/models/features/password-reset/password-reset-result';

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
  private readonly translateService = inject(TranslateService);
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

  // Error handling for token verification
  tokenVerificationErrorMessage: string | undefined = undefined;
  tokenVerificationResponse: PasswordResetResult | null = null;
  isTokenVerificationErrorMessageVisible = false;

  // Error handling for password update
  passwordUpdateErrorMessage: string | undefined = undefined;
  passwordUpdateResponse: PasswordResetResult | null = null;
  isPasswordUpdateErrorMessageVisible = false;

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupRouteParametersSubscription();
    this.setupLanguageChangeSubscription();
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

  // Language change handling
  private setupLanguageChangeSubscription(): void {
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateErrorMessagesForLanguageChange();
    });
  }

  private updateErrorMessagesForLanguageChange(): void {
    this.showTokenVerificationErrorMessage();
    this.showPasswordUpdateErrorMessage();
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
        next: (response) => this.handleTokenVerificationResponse(response),
      });
  }

  private handleTokenVerificationResponse(response: PasswordResetResult): void {
    this.isVerifying = false;

    if (!response.success) {
      this.isValidToken = false;
      this.isTokenVerificationErrorMessageVisible = true;
      this.tokenVerificationResponse = response;
      this.showTokenVerificationErrorMessage();
    } else {
      this.isValidToken = true;
      this.isTokenVerificationErrorMessageVisible = false;
      this.errorMessage = '';
    }
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
        next: (response) => this.handlePasswordUpdateResponse(response),
      });
  }

  private handlePasswordUpdateResponse(response: PasswordResetResult): void {
    if (!response.success) {
      this.isPasswordUpdateErrorMessageVisible = true;
      this.passwordUpdateResponse = response;
      this.showPasswordUpdateErrorMessage();
    } else {
      this.handlePasswordUpdateSuccess();
    }
  }

  private handlePasswordUpdateSuccess(): void {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);

    this.router.navigate(['/auth/login'], {
      queryParams: { message: 'password_reset_success' },
    });
  }

  showTokenVerificationErrorMessage(): void {
    if (!this.tokenVerificationResponse) {
      return;
    }

    const currentLanguage = this.translateService.currentLang;
    this.tokenVerificationErrorMessage =
      currentLanguage === 'ar'
        ? this.tokenVerificationResponse.messageAr
        : this.tokenVerificationResponse.messageEn;
  }

  showPasswordUpdateErrorMessage(): void {
    if (!this.passwordUpdateResponse) {
      return;
    }

    const currentLanguage = this.translateService.currentLang;
    this.passwordUpdateErrorMessage =
      currentLanguage === 'ar'
        ? this.passwordUpdateResponse.messageAr
        : this.passwordUpdateResponse.messageEn;
  }

  // Error message visibility control
  closeTokenVerificationErrorMessage(): void {
    this.isTokenVerificationErrorMessageVisible = false;
    this.tokenVerificationErrorMessage = '';
  }

  closePasswordUpdateErrorMessage(): void {
    this.isPasswordUpdateErrorMessageVisible = false;
    this.passwordUpdateErrorMessage = '';
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
