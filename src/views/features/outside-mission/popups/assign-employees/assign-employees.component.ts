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
import { MissionEmployeesAssignement } from '@/models/features/business/mission-employees-assignment';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
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
  selectedUsers: MissionEmployeesAssignement = new MissionEmployeesAssignement();
  selectedEmployees: UserProfileDataWithNationalId[] = [];
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
    // Load available employees for the table
    this.loadEmployees();
    this.model = this.data.model;
    this.departments = this.data.lookups.departments;
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode == ViewModeEnum.CREATE;

    // Pre-fill selected employees from already assigned employees
    if (this.model.assignedEmployees && this.model.assignedEmployees.length > 0) {
      // Copy into selectedEmployees
      this.selectedEmployees = [...this.model.assignedEmployees] as UserProfileDataWithNationalId[];

      // Fill employee IDs for checkbox checking
      this.selectedUsers.employeesIds = this.model.assignedEmployees
        .filter(emp => emp.id !== undefined)
        .map(emp => emp.id as number);
    }

  }

  override buildForm(): void { }
  override saveFail(error: Error): void { }
  override afterSave(model: WorkMission, dialogRef: M<any, any>): void { }
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
        error: () => { },
      });
  }
  // Add this method to check if all employees on current page are selected
  areAllCurrentPageSelected(): boolean {
    if (!this.employees || this.employees.length === 0) {
      return false;
    }

    return this.employees.every(employee =>
      employee.id && this.selectedUsers.employeesIds.includes(employee.id)
    );
  }

  // Update the existing toggleAll method to work better with the checkbox state
  toggleAll(checked: boolean): void {
    if (checked) {
      // Add all employees from current page that aren't already selected
      const newEmployees = this.employees.filter(
        (u) => u.id !== undefined && !this.selectedUsers.employeesIds.includes(u.id)
      );
      const newEmployeeIds = newEmployees.map((u) => u.id as number);

      // Add to selected arrays
      this.selectedUsers.employeesIds = [...this.selectedUsers.employeesIds, ...newEmployeeIds];

      // If you're using the selectedEmployees array from the previous solution
      if (this.selectedEmployees) {
        this.selectedEmployees = [...this.selectedEmployees, ...newEmployees];
      }
    } else {
      // Remove all employees from current page
      const currentPageEmployeeIds = this.employees
        .filter(u => u.id !== undefined)
        .map(u => u.id as number);

      this.selectedUsers.employeesIds = this.selectedUsers.employeesIds.filter(
        (userId) => !currentPageEmployeeIds.includes(userId)
      );

      // If you're using the selectedEmployees array from the previous solution
      if (this.selectedEmployees) {
        this.selectedEmployees = this.selectedEmployees.filter(
          (emp) => !currentPageEmployeeIds.includes(emp.id!)
        );
      }
    }
  }
  toggleUserSelection(userId: number, event?: Event) {
    if ((event?.target as HTMLInputElement)?.checked) {
      // Add if not already in the list
      if (!this.selectedUsers.employeesIds.some((id) => id === userId)) {
        const user = this.employees.find((u) => u.id === userId);
        if (user && !this.selectedUsers.employeesIds.some((id) => id === userId)) {
          this.selectedUsers.employeesIds.push(user.id as number);
          // Store the complete employee object
          this.selectedEmployees.push(user);
        }
      }
    } else {
      // Remove if unchecked
      this.selectedUsers.employeesIds = this.selectedUsers.employeesIds.filter((id) => id !== userId);
      this.selectedEmployees = this.selectedEmployees.filter((emp) => emp.id !== userId);
    }
  }
  isUserSelected(userId: number): boolean {
    return this.selectedUsers.employeesIds.some((id) => id === userId);
  }

  getSelectedEmployeeName(employeeId: number): string {
    const employee = this.selectedEmployees.find(emp => emp.id === employeeId);

    if (!employee) {
      return 'Employee ID: ' + employeeId; // Fallback
    }

    // Return name based on current language
    const currentLang = this.languageService.getCurrentLanguage();
    return currentLang === LANGUAGE_ENUM.ENGLISH
      ? (employee.nameEn || employee.nameAr || 'N/A')
      : (employee.nameAr || employee.nameEn || 'N/A');
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
        error: () => { },
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
    return this.isCurrentLanguageEnglish()
      ? 'nameEn'
      : 'nameAr';
  }
  saveAssignments() {
    this.selectedUsers.missionId = this.model?.id;
    this.workMissionService
      .addUsersToMission(this.selectedUsers)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(DIALOG_ENUM.OK);
        },
        error: () => { },
      });
  }
  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
  }
}
