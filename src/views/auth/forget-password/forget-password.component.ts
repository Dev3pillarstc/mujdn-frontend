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
  lastSubmittedData: PasswordResetRequestModel | null = null;
  errorMessage = '';
  resendLinkErrorMessage: string | undefined = undefined;
  resendLinkResponse: PasswordResetResult | null = null;

  forgetPasswordForm: FormGroup;

  constructor() {
    this.forgetPasswordForm = this.fb.group({
      nationalId: ['', [Validators.required, CustomValidators.pattern('NATIONAL_ID')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this.errorMessage = '';
      this.resendLinkErrorMessage = '';
      this.showResendLinkErrorMessage();
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
            this.isSentLink = true;
            // this.router.navigate(['/auth/sent-link']);
            console.log(response);
          },
          error: (error) => {
            // Handle error - you might want to show an error message
            // console.error('Password reset request failed:', error);
            this.errorMessage =
              this.translateService.instant('RESET_PASSWORD.' + error.error.error?.messageKey) ||
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
            console.log(response);
            if (!response.success) {
              this.resendLinkResponse = response;
              this.showResendLinkErrorMessage();
            }
            // For example, you could add a toast notification
          },
          error: (error) => {
            // Handle error - you might want to show an error message
            console.error('Resend password reset request failed:', error);
            this.errorMessage =
              this.translateService.instant('RESET_PASSWORD.' + error.error.error?.messageKey) ||
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

  onBackToForm() {
    this.isSentLink = false;
    this.lastSubmittedData = null;
    // Optionally clear the form or keep the values
    // this.forgetPasswordForm.reset();
  }

  onCancel() {
    this.router.navigate(['/auth/login']);
  }

  onBackToLogin() {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
