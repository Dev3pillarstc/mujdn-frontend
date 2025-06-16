import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Nationality } from '@/models/features/lookups/Nationality';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { Observable } from 'rxjs';
import { AlertService } from '@/services/shared/alert.service';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { NationalityService } from '@/services/features/lookups/nationality.service';

@Component({
  selector: 'app-nationality-popup',
  imports: [InputTextModule, ReactiveFormsModule, RequiredMarkerDirective],
  templateUrl: './nationality-popup.component.html',
  styleUrl: './nationality-popup.component.scss',
})
export class NationalityPopupComponent extends BasePopupComponent<Nationality> implements OnInit {
  declare model: Nationality;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(NationalityService);
  fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override saveFail(error: Error): void {
    // logic after error if there
  }

  override prepareModel(
    model: Nationality,
    form: FormGroup
  ): Nationality | Observable<Nationality> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override initPopup() {
    this.model = this.data.model;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  beforeSave(model: Nationality, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
}
