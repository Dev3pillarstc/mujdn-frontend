import { Component, inject, OnDestroy } from '@angular/core';
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
export default class ForgetPasswordComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private resetPasswordService = inject(ResetPasswordService);
  private destroy$ = new Subject<void>();
  private translateService = inject(TranslateService);

  isSentLink = false;
  isResentLink = false;
  lastSubmittedData: PasswordResetRequestModel | null = null;
  resendLinkErrorMessage: string | undefined = undefined;
  resendLinkResponse: PasswordResetResult | null = null;

  sendLinkErrorMessage: string | undefined = undefined;
  sendLinkResponse: PasswordResetResult | null = null;
  isSentLinkErrorMessageVisible = false;
  isResentLinkErrorMessageVisible = false;

  forgetPasswordForm: FormGroup;

  constructor() {
    this.forgetPasswordForm = this.fb.group({
      nationalId: ['', [Validators.required, CustomValidators.pattern('NATIONAL_ID')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this.showResendLinkErrorMessage();
      this.showSendLinkErrorMessage();
    });
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      const formData: PasswordResetRequestModel = {
        nationalId: this.forgetPasswordForm.get('nationalId')?.value,
        email: this.forgetPasswordForm.get('email')?.value,
      };

      // Store the form data for potential resend
      this.lastSubmittedData = formData;

      this.resetPasswordService
        .requestResetPassword(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (!response.success) {
              this.isSentLinkErrorMessageVisible = true;
              this.sendLinkResponse = response;
              console.log(this.sendLinkResponse);
              this.showSendLinkErrorMessage();
            } else {
              this.isSentLink = true;
              this.isSentLinkErrorMessageVisible = false;
            }
          },
          error: (error) => {
            // Handle error - you might want to show an error message
            // console.error('Password reset request failed:', error);
            this.isSentLinkErrorMessageVisible = true;
            this.sendLinkErrorMessage =
              this.translateService.instant('COMMON.' + error.error.error?.messageKey) ||
              'Password reset request failed.';
            // Reset the stored data if request failed
            this.lastSubmittedData = null;
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.forgetPasswordForm.controls).forEach((key) => {
        this.forgetPasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  onResendLink() {
    if (this.lastSubmittedData) {
      this.resetPasswordService
        .requestResetPassword(this.lastSubmittedData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            // You can show a success message here if needed
            if (!response.success) {
              this.isResentLinkErrorMessageVisible = true;
              this.resendLinkResponse = response;
              this.showResendLinkErrorMessage();
            } else {
              this.isResentLink = true;
              this.isResentLinkErrorMessageVisible = false;
            }
            // For example, you could add a toast notification
          },
          error: (error) => {
            // Handle error - you might want to show an error message
            console.error('Resend password reset request failed:', error);
            this.isResentLinkErrorMessageVisible = true;
            this.resendLinkErrorMessage =
              this.translateService.instant('COMMON.' + error.error.error?.messageKey) ||
              'Resend password reset request failed.';
          },
        });
    }
  }

  showResendLinkErrorMessage() {
    const currentLanguage = this.translateService.currentLang;
    this.resendLinkErrorMessage =
      currentLanguage === 'ar'
        ? this.resendLinkResponse?.messageAr
        : this.resendLinkResponse?.messageEn;
  }

  showSendLinkErrorMessage() {
    const currentLanguage = this.translateService.currentLang;
    this.sendLinkErrorMessage =
      currentLanguage === 'ar'
        ? this.sendLinkResponse?.messageAr
        : this.sendLinkResponse?.messageEn;
  }

  onBackToForm() {
    this.isSentLink = false;
    this.lastSubmittedData = null;
    // Optionally clear the form or keep the values
    // this.forgetPasswordForm.reset();
  }

  onCancel() {
    this.router.navigate(['/auth/login']);
  }

  closeSendLinkErrorMessage() {
    this.isSentLinkErrorMessageVisible = false;
    this.sendLinkErrorMessage = '';
  }

  closeResendLinkErrorMessage() {
    this.isResentLinkErrorMessageVisible = false;
    this.resendLinkErrorMessage = '';
  }

  onBackToLogin() {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
