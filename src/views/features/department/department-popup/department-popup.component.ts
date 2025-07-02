import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { Department } from '@/models/features/lookups/department/department';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@/services/shared/alert.service';
import { City } from '@/models/features/lookups/city/city';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UserProfilesLookup } from '@/models/auth/users-profiles-lookup';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { TranslatePipe } from '@ngx-translate/core';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-department-popup',
  imports: [
    Select,
    DatePickerModule,
    FormsModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './department-popup.component.html',
  styleUrl: './department-popup.component.scss',
})
export class DepartmentPopupComponent extends BasePopupComponent<Department> implements OnInit {
  declare model: Department;
  declare form: FormGroup;
  declare viewMode: ViewModeEnum;
  isCreateMode = false;
  alertService = inject(AlertService);
  fb = inject(FormBuilder);
  cities: City[] = [];
  regions: BaseLookupModel[] = [];
  usersProfiles: UserProfilesLookup[] = new Array<UserProfilesLookup>();
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  filteredCities: City[] = [];
  levelType: string = 'one-level';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  get langOptionLabel(): string {
    const lang = this.languageService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  override initPopup() {
    // First, initialize the model and data
    this.model = this.data.model;
    this.cities = this.data.lookups.cities;
    this.regions = this.data.lookups.regions;
    this.usersProfiles = this.data.lookups.usersProfiles || [];
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode == ViewModeEnum.CREATE;

    // Build the form first
    this.buildForm();

    // Then initialize filtered cities
    this.initializeFilteredCities();

    // Finally, set up the region change listener
    this.setupRegionChangeListener();
  }

  onRegionChange(event: any): void {
    const regionId = event.value;
    this.filterCitiesByRegion(regionId);
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  setupRegionChangeListener(): void {
    this.form.get('fkRegionId')?.valueChanges.subscribe((regionId) => {
      this.filterCitiesByRegion(regionId);
    });
  }

  override saveFail(error: Error): void {
    const errorObject = { messages: ['COMMON.SAVE_FAILED'] };
    this.alertService.showErrorMessage(errorObject);
  }

  override afterSave(model: Department, dialogRef: MatDialogRef<any, any>): void {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  override beforeSave(model: Department, form: FormGroup): Observable<boolean> | boolean {
    if (!form.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(form.controls).forEach((key) => {
        form.get(key)?.markAsTouched();
      });
      return false;
    }

    return true;
  }

  override prepareModel(model: Department, form: FormGroup): Department | Observable<Department> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  private initializeFilteredCities(): void {
    const currentRegionId = this.model.fkRegionId;
    this.filterCitiesByRegion(currentRegionId);
  }

  private filterCitiesByRegion(regionId: any): void {
    if (regionId) {
      this.filteredCities = this.cities.filter((city) => city.fkRegionId === regionId);
    } else {
      this.filteredCities = [];
    }

    const currentCityId = this.form.get('fkCityId')?.value;
    if (currentCityId && !this.filteredCities.some((city) => city.id === currentCityId)) {
      this.form.get('fkCityId')?.setValue(null);
    }
  }

  // Helper method to debug form errors
  private getFormErrors(form: FormGroup): any {
    const errors: any = {};
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
