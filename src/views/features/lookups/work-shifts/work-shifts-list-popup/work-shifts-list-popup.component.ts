import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable } from 'rxjs';
import { ShiftService } from '@/services/features/lookups/shift.service';
import { AlertService } from '@/services/shared/alert.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { TranslatePipe } from '@ngx-translate/core';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { CustomValidators } from '@/validators/custom-validators';

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
  isCreateMode = false;
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
  // get isDefaultShiftControl() {
  //   return this.form.get('isDefaultShift') as FormControl;
  // }
  override initPopup(): void {
    this.model = this.data.model;
    this.isCreateMode = this.data.viewMode == ViewModeEnum.CREATE;
  }
  override buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(), {
      validators: [CustomValidators.timeFromBeforeTimeTo('timeFrom', 'timeTo')],
    });
  }

  override saveFail(error: Error): void {}

  override beforeSave(model: Shift, form: FormGroup): Observable<boolean> | boolean {
    // if (!form.valid) {
    //   return false;
    // }
    // // set seconds to 0 for both timeFrom and timeTo for comparison
    // const timeFrom: Date = form.get('timeFrom')?.value;
    // const timeTo: Date = form.get('timeTo')?.value;
    // timeFrom?.setSeconds(0);
    // timeTo?.setSeconds(0);

    // if (timeFrom && timeTo && timeFrom >= timeTo) {
    //   this.alertService.showErrorMessage({
    //     messages: ['WORK_SHIFTS_POPUP.TIME_FROM_MUST_BE_LESS_THAN_TIME_TO'],
    //   });
    //   return false;
    // }

    return form.valid;
  }
  override afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
  override prepareModel(model: Shift, form: FormGroup): Shift | Observable<Shift> {
    const formValue = { ...form.value };

    return Object.assign(model, {
      ...formValue,
      timeFrom: this.dateToTimeString(formValue.timeFrom),
      timeTo: this.dateToTimeString(formValue.timeTo),
    });
  }

  private dateToTimeString(date: Date): string | null {
    if (!date) return null;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}:00`;
  }
}
