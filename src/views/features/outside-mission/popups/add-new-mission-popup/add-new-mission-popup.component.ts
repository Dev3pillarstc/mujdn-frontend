import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { WorkMission } from '@/models/features/business/work-mission';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable } from 'rxjs';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';

@Component({
  selector: 'app-add-new-mission-popup',
  imports: [
    DatePickerModule,
    FormsModule,
    TextareaModule,
    InputTextModule,
    TabsModule,
    TableModule,
    Select,
    PaginatorModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './add-new-mission-popup.component.html',
  styleUrl: './add-new-mission-popup.component.scss',
})
export class AddNewMissionPopupComponent extends BasePopupComponent<WorkMission> implements OnInit {
  override initPopup(): void {
    this.model = this.data.model;
  }
  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }
  override saveFail(error: Error): void {}
  override afterSave(model: WorkMission, dialogRef: M<any, any>): void {}
  override beforeSave(model: WorkMission, form: FormGroup): Observable<boolean> | boolean {
    return true;
  }
  override prepareModel(
    model: WorkMission,
    form: FormGroup
  ): WorkMission | Observable<WorkMission> {
    this.model = Object.assign(model, { ...form.value });
    return model;
  }
  date2: Date | undefined;
  model!: WorkMission;
  declare form: FormGroup;
  translateService = inject(TranslateService);

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { model: WorkMission }
  ) {
    super();
    this.model = data.model;
    console.log(this.form);
    console.log(this.form);
  }
  get nameArControl() {
    return this.form.get('nameAr') as FormControl;
  }
  get nameEnControl() {
    return this.form.get('nameEn') as FormControl;
  }
  get startDateControl() {
    return this.form.get('startDate') as FormControl;
  }
  get endDateControl() {
    return this.form.get('endDate') as FormControl;
  }
  get descriptionControl() {
    return this.form.get('description') as FormControl;
  }
}
