import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { filter, Observable, switchMap } from 'rxjs';
import { ShiftService } from '@/services/features/lookups/shift.service';
import { AlertService } from '@/services/shared/alert.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { CustomValidators } from '@/validators/custom-validators';
import { InputNumberModule } from 'primeng/inputnumber';
import { dateToTimeString, toDateOnly } from '@/utils/general-helper';
import { ConfirmationService } from '@/services/shared/confirmation.service';
import { CONFIRMATION_DIALOG_ICONS_ENUM } from '@/enums/confirmation-dialog-icons-enum';

@Component({
  selector: 'app-work-shifts-list-popup',
  imports: [
    DatePickerModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    ValidationMessagesComponent,
    TranslatePipe,
    RequiredMarkerDirective,
    InputNumberModule,
  ],
  templateUrl: './work-shifts-list-popup.component.html',
  styleUrl: './work-shifts-list-popup.component.scss',
})
export class WorkShiftsListPopupComponent extends BasePopupComponent<Shift> implements OnInit {
  declare model: Shift;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(ShiftService);
  fb = inject(FormBuilder);
  confirmationService = inject(ConfirmationService);
  translateService = inject(TranslateService);
  isCreateMode = false;
  matDialog = inject(MatDialog);
  editableControlsInEditMode = ['nameAr', 'nameEn', 'isDefaultShiftForm', 'shiftLogStartDate'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  get nameArControl() {
    return this.form.get('nameAr') as FormControl;
  }

  get nameEnControl() {
    return this.form.get('nameEn') as FormControl;
  }

  get timeFromControl() {
    return this.form.get('timeFrom') as FormControl;
  }

  get timeToControl() {
    return this.form.get('timeTo') as FormControl;
  }

  get attendanceBufferControl() {
    return this.form.get('attendanceBuffer') as FormControl;
  }

  get leaveBufferControl() {
    return this.form.get('leaveBuffer') as FormControl;
  }

  get shiftLogStartDateControl() {
    return this.form.get('shiftLogStartDate') as FormControl;
  }

  get canActivateShift(): boolean {
    const today = toDateOnly(new Date());
    const shiftDate = this.model.shiftLogStartDate
      ? toDateOnly(this.model.shiftLogStartDate)
      : null;

    return !this.model.isActive && shiftDate !== null && shiftDate <= today;
  }

  override initPopup(): void {
    this.model = this.data.model;
    this.isCreateMode = this.data.viewMode == ViewModeEnum.CREATE;
  }

  override buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(), {
      validators: [CustomValidators.timeFromBeforeTimeTo('timeFrom', 'timeTo')],
    });

    if (!this.isCreateMode) {
      Object.keys(this.form.controls).forEach((key) => {
        if (!this.editableControlsInEditMode.includes(key)) {
          this.form.get(key)?.disable({ emitEvent: false });
        }
      });

      if (this.model.isActive) {
        this.form.get('isDefaultShiftForm')?.disable({ emitEvent: false });
        this.form.get('shiftLogStartDate')?.disable({ emitEvent: false });
      }
    }

    // Only attach valueChanges logic if not locked
    if (!this.model.shiftLogId) {
      this.form.get('isDefaultShiftForm')?.valueChanges.subscribe((isDefault: boolean) => {
        const shiftLogStartDateControl = this.form.get('shiftLogStartDate');
        if (isDefault) {
          shiftLogStartDateControl?.setValidators([Validators.required]);
          shiftLogStartDateControl?.enable({ emitEvent: false });
        } else {
          shiftLogStartDateControl?.clearValidators();
          shiftLogStartDateControl?.setValue(null);
          shiftLogStartDateControl?.disable({ emitEvent: false });
        }
        shiftLogStartDateControl?.updateValueAndValidity();
      });
    }

    // Subscribe to shiftLogStartDate changes and set isActive
    this.form.get('shiftLogStartDate')?.valueChanges.subscribe((dateValue) => {
      if (dateValue) {
        this.form.patchValue({ isActive: false }, { emitEvent: false });
      }
    });
  }

  override saveFail(error: Error): void {}

  override beforeSave(model: Shift, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }

  override afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  override prepareModel(model: Shift, form: FormGroup): Shift | Observable<Shift> {
    const formValue = { ...form.getRawValue() }; // Changed from form.value to form.getRawValue()

    // Only send shiftLogStartDate if isDefaultShiftForm is true
    if (!form.get('isDefaultShiftForm')?.value) {
      formValue.shiftLogStartDate = null;
    }

    return Object.assign(model, {
      ...formValue,
      timeFrom: dateToTimeString(formValue.timeFrom),
      timeTo: dateToTimeString(formValue.timeTo),
    });
  }

  activateShift(): void {
    // Early return if model or required data is missing
    if (!this.model?.id) {
      this.alertService.showErrorMessage({
        messages: ['COMMON.SERVER_INVALID_OPERATION'],
      });
      return;
    }

    const confirmMessage = this.buildConfirmationMessage();

    const confirmationData = {
      icon: CONFIRMATION_DIALOG_ICONS_ENUM.WARNING.toString(),
      messages: [confirmMessage],
    };

    this.shiftLogStartDateControl.valid &&
      this.confirmationService
        .open(confirmationData)
        .afterClosed()
        .pipe(
          filter((result) => result === DIALOG_ENUM.OK),
          switchMap(() => this.performShiftActivation())
        )
        .subscribe({
          next: () => {
            this.alertService.showSuccessMessage({
              messages: ['WORK_SHIFTS_POPUP.ACTIVATED_SUCCESSFULLY'],
            });
            this.dialogRef.close(DIALOG_ENUM.OK);
          },
          error: (error) => this.handleActivationError(error),
        });
  }

  private buildConfirmationMessage(): string {
    const formattedDate = this.formatShiftDate();
    return this.translateService.instant('WORK_SHIFTS_POPUP.ACTIVATION_CONFIRM', {
      date: formattedDate,
    });
  }

  private formatShiftDate(): string {
    if (!this.model.shiftLogStartDate) {
      return this.translateService.instant('COMMON.SERVER_INVALID_OPERATION');
    }

    return new Date(this.model.shiftLogStartDate).toLocaleDateString('en-GB');
  }

  private performShiftActivation(): Observable<any> {
    const shift = new Shift();
    shift.isActive = true;
    return this.service.activateShift(shift, this.model.id!);
  }

  private handleActivationError(error: any): void {
    this.alertService.showErrorMessage({
      messages: ['WORK_SHIFTS_POPUP.ACTIVATION_FAILED'],
    });
  }
}
