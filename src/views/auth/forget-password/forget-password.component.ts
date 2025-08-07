import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { PasswordResetRequestModel } from '@/models/features/password-reset/password-reset-request-model';
import { CustomValidators } from '@/validators/custom-validators';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { ResetPasswordService } from '@/services/features/reset-password.service';
import { PasswordResetResult } from '@/models/features/password-reset/password-reset-result';

@Component({
  selector: 'app-forget-password',
  imports: [InputTextModule, ReactiveFormsModule, TranslatePipe, ValidationMessagesComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export default class ForgetPasswordComponent implements OnInit, OnDestroy {
  // Dependencies
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly resetPasswordService = inject(ResetPasswordService);
  private readonly translateService = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  // Form
  forgetPasswordForm!: FormGroup;

  // State flags
  isSentLink = false;
  isResentLink = false;

  // Data storage
  lastSubmittedData: PasswordResetRequestModel | null = null;

  // Error handling for send link
  sendLinkErrorMessage: string | undefined = undefined;
  sendLinkResponse: PasswordResetResult | null = null;
  isSentLinkErrorMessageVisible = false;

  // Error handling for resend link
  resendLinkErrorMessage: string | undefined = undefined;
  resendLinkResponse: PasswordResetResult | null = null;
  isResentLinkErrorMessageVisible = false;

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupLanguageChangeSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Form initialization
  private initializeForm(): void {
    this.forgetPasswordForm = this.fb.group({
      nationalId: ['', [Validators.required, CustomValidators.pattern('NATIONAL_ID')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Language change handling
  private setupLanguageChangeSubscription(): void {
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateErrorMessagesForLanguageChange();
    });
  }

  private updateErrorMessagesForLanguageChange(): void {
    this.showResendLinkErrorMessage();
    this.showSendLinkErrorMessage();
  }

  // Form submission
  onSubmit(): void {
    if (!this.forgetPasswordForm.valid) {
      this.markFormFieldsAsTouched();
      return;
    }

    const formData = this.getFormData();
    this.lastSubmittedData = formData;
    this.sendResetPasswordRequest(formData);
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.forgetPasswordForm.controls).forEach((key) => {
      this.forgetPasswordForm.get(key)?.markAsTouched();
    });
  }

  private getFormData(): PasswordResetRequestModel {
    return {
      nationalId: this.forgetPasswordForm.get('nationalId')?.value,
      email: this.forgetPasswordForm.get('email')?.value,
    };
  }

  private sendResetPasswordRequest(formData: PasswordResetRequestModel): void {
    this.resetPasswordService
      .requestResetPassword(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleSendLinkResponse(response),
      });
  }

  private handleSendLinkResponse(response: PasswordResetResult): void {
    if (!response.success) {
      this.isSentLinkErrorMessageVisible = true;
      this.sendLinkResponse = response;
      this.showSendLinkErrorMessage();
    } else {
      this.isSentLink = true;
      this.isSentLinkErrorMessageVisible = false;
    }
  }

  // Resend link functionality
  onResendLink(): void {
    if (!this.lastSubmittedData) {
      return;
    }

    this.resetPasswordService
      .requestResetPassword(this.lastSubmittedData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleResendLinkResponse(response),
      });
  }

  private handleResendLinkResponse(response: PasswordResetResult): void {
    if (!response.success) {
      this.isResentLinkErrorMessageVisible = true;
      this.resendLinkResponse = response;
      this.showResendLinkErrorMessage();
    } else {
      this.isResentLink = true;
      this.isResentLinkErrorMessageVisible = false;
    }
  }

  showResendLinkErrorMessage(): void {
    if (!this.resendLinkResponse) {
      return;
    }

    const currentLanguage = this.translateService.currentLang;
    this.resendLinkErrorMessage =
      currentLanguage === 'ar'
        ? this.resendLinkResponse.messageAr
        : this.resendLinkResponse.messageEn;
  }

  showSendLinkErrorMessage(): void {
    if (!this.sendLinkResponse) {
      return;
    }

    const currentLanguage = this.translateService.currentLang;
    this.sendLinkErrorMessage =
      currentLanguage === 'ar' ? this.sendLinkResponse.messageAr : this.sendLinkResponse.messageEn;
  }

  // Error message visibility control
  closeSendLinkErrorMessage(): void {
    this.isSentLinkErrorMessageVisible = false;
    this.sendLinkErrorMessage = '';
  }

  closeResendLinkErrorMessage(): void {
    this.isResentLinkErrorMessageVisible = false;
    this.resendLinkErrorMessage = '';
  }

  // Navigation
  onBackToForm(): void {
    this.isSentLink = false;
    this.lastSubmittedData = null;
  }

  onCancel(): void {
    this.navigateToLogin();
  }

  onBackToLogin(): void {
    this.navigateToLogin();
  }

  private navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
