import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { UserProfile } from '@/models/features/user-profile/user-profile';
import { UserProfileService } from '@/services/features/user-profile.service';
import { Subject, takeUntil, finalize } from 'rxjs';
import { AlertService } from '@/services/shared/alert.service';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-info-popup',
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './edit-info-popup.component.html',
  styleUrl: './edit-info-popup.component.scss',
})
export class EditInfoPopupComponent implements OnInit {
  declare direction: LAYOUT_DIRECTION_ENUM;
  form!: FormGroup;
  userProfile!: UserProfile;
  isLoading = false;

  private destroy$ = new Subject<void>();
  save$ = new Subject<void>();

  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);
  fb = inject(FormBuilder);
  userProfileService = inject(UserProfileService);
  alertService = inject(AlertService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
    this.userProfile = this.data;
  }

  ngOnInit() {
    this.initializeForm();
    this.setupSaveSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.form = this.fb.group(this.userProfile.buildForm());
  }

  private setupSaveSubscription() {
    this.save$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.save();
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;

    // Update the user profile object with form data
    this.userProfile.email = formData.email;
    this.userProfile.phoneNumber = formData.phoneNumber;

    this.userProfileService
      .updateUserProfile(this.userProfile)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (updatedProfile) => {
          this.alertService.showSuccessMessage({
            messages: ['PROFILE_PAGE.PROFILE_UPDATED_SUCCESSFULLY'],
          });
          this.dialogRef.close(updatedProfile);
        },
        error: (error) => {
          console.error('Error updating user profile:', error);
          this.alertService.showErrorMessage({ messages: ['PROFILE_PAGE.ERROR_UPDATING_PROFILE'] });
        },
      });
  }

  close() {
    this.dialogRef.close();
  }

  // Getter methods for form controls (for validation)
  get emailControl() {
    return this.form.get('email')!;
  }

  get phoneNumberControl() {
    return this.form.get('phoneNumber')!;
  }
}
