import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { WorkMission } from '@/models/features/business/work-mission';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable, timeout } from 'rxjs';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserProfileDataWithNationalId } from '@/models/features/business/user-profile-data-with-national-id';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { PaginationParams } from '@/models/shared/pagination-params';
import { OptionsContract } from '@/contracts/options-contract';
import { TranslatePipe } from '@ngx-translate/core';
interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-assign-employees',
  imports: [
    FormsModule,
    Select,
    DatePickerModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    PaginatorModule,
    TranslatePipe,
  ],
  templateUrl: './assign-employees.component.html',
  styleUrl: './assign-employees.component.scss',
})
export class AssignEmployeesComponent extends BasePopupComponent<WorkMission> {
  override model: WorkMission = new WorkMission();
  override form: FormGroup<any> = new FormGroup({});
  declare viewMode: ViewModeEnum;
  isCreateMode = false;
  employeesData: PaginatedList<UserProfileDataWithNationalId> =
    new PaginatedList<UserProfileDataWithNationalId>();
  employees: UserProfileDataWithNationalId[] = [];
  paginationInfo: PaginationInfo = new PaginationInfo();
  departments: BaseLookupModel[] = [];
  workMissionService = inject(WorkMissionService);
  paginationParams: PaginationParams = new PaginationParams();
  filterModel: OptionsContract = {};
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      model: WorkMission;
      viewMode: ViewModeEnum;
      lookups: {
        departments: BaseLookupModel[];
      };
    }
  ) {
    super();
  }
  override initPopup(): void {
    this.model = this.data.model;
    this.loadEmployees();
    this.departments = this.data.lookups.departments;
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode == ViewModeEnum.CREATE;
  }
  override buildForm(): void {}
  override saveFail(error: Error): void {}
  override afterSave(model: WorkMission, dialogRef: M<any, any>): void {}
  override beforeSave(model: WorkMission, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }
  override prepareModel(
    model: WorkMission,
    form: FormGroup
  ): WorkMission | Observable<WorkMission> {
    return model;
  }
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;

  selectedAdminstration: Adminstration | undefined;
  declare direction: LAYOUT_DIRECTION_ENUM;
  adminstrations: Adminstration[] | undefined;

  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.workMissionService
      .getEmployeesToBeAssigned(this.paginationParams, this.filterModel)
      .subscribe({
        next: (response) => {
          this.employees = response.data.list;
          this.paginationInfo = response.data.paginationInfo;
        },
        error: () => {},
      });
  }

  search() {
    this.first = 0;
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.loadEmployees();
  }

  private loadEmployees() {
    this.workMissionService
      .getEmployeesToBeAssigned(this.paginationParams, this.filterModel)
      .subscribe({
        next: (response) => {
          this.employees = response.data.list;
          this.paginationInfo = response.data.paginationInfo;
        },
        error: () => {},
      });
  }
  resetSearch() {
    this.filterModel = {};
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadEmployees();
  }

  getPropertyName(): string {
    return this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
      ? 'nameEn'
      : 'nameAr';
  }
}
