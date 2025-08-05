import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { PasswordResetRequestModel } from '@/models/features/password-reset/password-reset-request-model';
import { CustomValidators } from '@/validators/custom-validators';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { ResetPasswordService } from '@/services/features/reset-password.service';

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

  forgetPasswordForm: FormGroup;
  isLoading = false;

  constructor() {
    this.forgetPasswordForm = this.fb.group({
      nationalId: ['', [Validators.required, CustomValidators.pattern('NATIONAL_ID')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formData: PasswordResetRequestModel = {
        nationalId: this.forgetPasswordForm.get('nationalId')?.value,
        email: this.forgetPasswordForm.get('email')?.value,
      };

      this.resetPasswordService
        .requestResetPassword(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.router.navigate(['/auth/sent-link']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Password reset request failed:', error);
            // Handle error (show toast, error message, etc.)
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.forgetPasswordForm.controls).forEach((key) => {
        this.forgetPasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
