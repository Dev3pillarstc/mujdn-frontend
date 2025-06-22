import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { RegionService } from '@/services/features/lookups/region.service';
import { AlertService } from '@/services/shared/alert.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { Region } from '@/models/features/lookups/region/region';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-region-popup',
  imports: [InputTextModule, ReactiveFormsModule, RequiredMarkerDirective, TranslatePipe],
  templateUrl: './region-popup.component.html',
  styleUrl: './region-popup.component.scss',
})
export class RegionPopupComponent extends BasePopupComponent<Region> implements OnInit {
  declare model: Region;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(RegionService);
  fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override saveFail(error: Error): void {
    // logic after error if there
  }

  override prepareModel(model: Region, form: FormGroup): Region | Observable<Region> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override initPopup() {
    this.model = this.data.model;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  beforeSave(model: Region, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
  get nameArControl() {
    return this.form.get('nameAr') as FormControl;
  }

  get nameEnControl() {
    return this.form.get('nameEn') as FormControl;
  }
}
