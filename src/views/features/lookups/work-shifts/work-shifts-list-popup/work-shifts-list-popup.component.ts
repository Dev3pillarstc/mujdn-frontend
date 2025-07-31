import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Observable } from 'rxjs';
import { ShiftService } from '@/services/features/lookups/shift.service';
import { AlertService } from '@/services/shared/alert.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { TranslatePipe } from '@ngx-translate/core';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { DefaultShiftDurationComponent } from '../default-shift-duration/default-shift-duration.component';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { CustomValidators } from '@/validators/custom-validators';
import { InputNumberModule } from 'primeng/inputnumber';
import { dateToTimeString } from '@/utils/general-helper';

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
  isCreateMode = false;
  durationDialogSize = {
    width: '100%',
    maxWidth: '504px',
  };
  matDialog = inject(MatDialog);
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
      timeFrom: dateToTimeString(formValue.timeFrom),
      timeTo: dateToTimeString(formValue.timeTo),
    });
  }

  openDurationDialog(): void {
    const model = { id: 1 };
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model: model, viewMode: viewMode };
    dialogConfig.width = this.durationDialogSize.width;
    dialogConfig.maxWidth = this.durationDialogSize.maxWidth;
    const dialogRef = this.matDialog.open(DefaultShiftDurationComponent as any, dialogConfig);

    dialogRef.afterClosed().subscribe();
  }
}
