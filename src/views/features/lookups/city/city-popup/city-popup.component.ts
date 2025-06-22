import { Component, Inject, inject, OnInit } from '@angular/core';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { City } from '@/models/features/lookups/city/city';
import { CityService } from '@/services/features/lookups/city.service';
import { AlertService } from '@/services/shared/alert.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { RegionService } from '@/services/features/lookups/region.service';
import { Region } from '@/models/features/lookups/region/region';
import { Select } from 'primeng/select';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

@Component({
  selector: 'app-city-popup',
  imports: [Select, InputTextModule, ReactiveFormsModule, RequiredMarkerDirective, TranslatePipe],
  templateUrl: './city-popup.component.html',
  styleUrl: './city-popup.component.scss',
})
export class CityPopupComponent extends BasePopupComponent<City> implements OnInit {
  declare model: City;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(CityService);
  regionService = inject(RegionService);
  fb = inject(FormBuilder);
  regions: Region[] | undefined = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override saveFail(error: Error): void {
    // logic after error if there
  }

  override prepareModel(model: City, form: FormGroup): City | Observable<City> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }
  override initPopup() {
    this.model = this.data.model;
    this.loadLookups();
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  beforeSave(model: City, form: FormGroup) {
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

  get regionControl() {
    return this.form.get('fkRegionId') as FormControl;
  }

  loadLookups() {
    this.regionService.load().subscribe({
      next: (result) => {
        this.regions = result;
      },
    });
  }

  getRegionOptionName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }
}
