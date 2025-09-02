import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';
import { ChangeUserPasswordModel } from '@/models/features/user-profile/change-user-password-model';
import { Subject, takeUntil } from 'rxjs';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { UserProfileService } from '@/services/features/user-profile.service';
import { TranslatePipe } from '@ngx-translate/core';
import { markFormGroupTouched } from '@/utils/general-helper';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { AlertService } from '@/services/shared/alert.service';

@Component({
  selector: 'app-change-password-popup',
  imports: [
    CommonModule,
    InputTextModule,
    Password,
    ReactiveFormsModule,
    ValidationMessagesComponent,
    TranslatePipe,
    RequiredMarkerDirective,
  ],
  templateUrl: './change-password-popup.component.html',
  styleUrl: './change-password-popup.component.scss',
})
export class ChangePasswordPopupComponent {
  declare direction: LAYOUT_DIRECTION_ENUM;
  form: FormGroup;
  save$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);
  fb = inject(FormBuilder);
  userProfileService = inject(UserProfileService);
  alertService = inject(AlertService);

  constructor() {
    this.form = this.createForm();
    this.listenToSave();
  }

  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
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

  private listenToSave() {
    this.save$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.changePassword();
    });
  }

  private changePassword() {
    if (!this.form.valid) {
      markFormGroupTouched(this.form);
      return;
    }

    const model = new ChangeUserPasswordModel();
    model.oldPassword = this.form.get('oldPassword')?.value;
    model.newPassword = this.form.get('newPassword')?.value;

    this.userProfileService
      .changeUserPassword(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Handle success - you might want to show a success message
          this.dialogRef.close(true);
          this.afterSave();
        },
        error: (error) => {
          // Handle error - you might want to show an error message
          console.error('Failed to change password:', error);
        },
      });
  }
  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  // Getters for form controls to use in template
  get oldPasswordControl() {
    return this.form.get('oldPassword')!;
  }

  get newPasswordControl() {
    return this.form.get('newPassword')!;
  }

  get confirmPasswordControl() {
    return this.form.get('confirmPassword')!;
  }

  close() {
    this.dialogRef.close();
  }
}
