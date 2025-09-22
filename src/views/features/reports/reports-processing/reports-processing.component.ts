import { AccordionModule } from 'primeng/accordion';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { LanguageService } from '@/services/shared/language.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserService } from '@/services/features/user.service';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { Department } from '@/models/features/lookups/department/department';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { ManualProcessing } from '@/models/features/business/manual-processing';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { RequiredMarkerDirective } from '../../../../directives/required-marker.directive';
import { AlertService } from '@/services/shared/alert.service';
import { ConfirmationService } from '@/services/shared/confirmation.service';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { CustomValidators } from '@/validators/custom-validators';

interface DepartmentEmployees {
  department: BaseLookupModel;
  employees: UsersWithDepartmentLookup[];
}

@Component({
  selector: 'app-reports-processing',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    Select,
    MultiSelect,
    AccordionModule,
    TranslatePipe,
    ValidationMessagesComponent,
    RequiredMarkerDirective,
  ],
  templateUrl: './reports-processing.component.html',
  styleUrl: './reports-processing.component.scss',
})
export default class ReportsProcessingComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  items: MenuItem[] | undefined;
  translateService = inject(TranslateService);
  destroy$: Subject<void> = new Subject<void>();
  langService = inject(LanguageService);
  activatedRoute = inject(ActivatedRoute);
  departmentService = inject(DepartmentService);
  userService = inject(UserService);
  confirmationService = inject(ConfirmationService);
  alertService = inject(AlertService);
  fb = inject(FormBuilder);

  departmentList: BaseLookupModel[] = [];
  employeeList: UsersWithDepartmentLookup[] = [];
  filteredEmployeeList: UsersWithDepartmentLookup[] = [];
  selectedEmployees: UsersWithDepartmentLookup[] = [];
  selectedDepartments: BaseLookupModel[] = [];
  processAllEmployees = false;

  // Grouped employees by department for accordion display
  departmentEmployeesGroups: DepartmentEmployees[] = [];

  private readonly _minAllowedDate = new Date(2025, 0, 1); // Jan 1, 2025
  private readonly _maxAllowedDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1); // yesterday
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  // global min / max for both pickers
  get minAllowedDate(): Date {
    return this._minAllowedDate;
  }
  get maxAllowedDate(): Date {
    return this._maxAllowedDate;
  }

  breadcrumbs: MenuItem[] = [];
  home = {
    label: this.translateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home',
  };

  // Current language
  currentLang = 'ar'; // Default to Arabic

  ngOnInit() {
    this.initializeForm();
    this.setHomeItem();
    this.initBreadcrumbs();
    this.loadLookups();

    // Get current language
    this.currentLang =
      this.langService.getCurrentLanguage() || this.translateService.currentLang || 'ar';

    // Listen to language changes
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((langChangeEvent) => {
        this.currentLang = langChangeEvent.lang;
        this.setHomeItem();
        this.initBreadcrumbs();
      });

    // Listen to language service changes if available
    this.langService.languageChanged$.pipe(takeUntil(this.destroy$)).subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }

  initializeForm(): void {
    const model = new ManualProcessing();
    const formConfig = model.buildForm();

    this.form = this.fb.group(
      {
        dateFrom: formConfig.dateFrom,
        dateTo: formConfig.dateTo,
        userIds: formConfig.userIds,
        departmentIds: [null], // Changed from departmentId to departmentIds for multi-select
      },
      {
        validators: [
          CustomValidators.dateRangeValidator(this.minAllowedDate, this.maxAllowedDate, 3),
        ],
      }
    );

    // Watch for department changes to filter employees
    this.form
      .get('departmentIds')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((departmentIds) => {
        this.onDepartmentChange(departmentIds);
      });

    // Watch for employee selection changes
    this.form
      .get('userIds')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((userIds) => {
        this.onEmployeeSelectionChange(userIds);
      });
  }

  loadLookups(): void {
    this.departmentService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.departmentList = res;
    });

    this.userService.getUsersWithDepartment().subscribe((res: UsersWithDepartmentLookup[]) => {
      this.employeeList = res;
      this.filteredEmployeeList = [];
    });
  }

  onDepartmentChange(departmentIds: number[] | null): void {
    // Get previously selected departments
    const previousDepartmentIds = this.selectedDepartments.map((dept) => dept.id);

    if (departmentIds && departmentIds.length > 0) {
      // Update selected departments
      this.selectedDepartments = this.departmentList.filter((dept) =>
        departmentIds.includes(dept.id || 0)
      );

      // Find deselected departments
      // const deselectedDepartmentIds = previousDepartmentIds.filter(
      //   (prevId) => !departmentIds.includes(prevId || 0)
      // );

      // Remove employees from deselected departments
      // if (deselectedDepartmentIds.length > 0) {
      //   this.removeEmployeesFromDeselectedDepartments(deselectedDepartmentIds);
      // }

      // Filter employees by selected departments
      this.filteredEmployeeList = this.employeeList.filter((emp) =>
        departmentIds.includes(emp.departmentId || 0)
      );
    } else {
      // No departments selected - clear everything
      this.selectedDepartments = [];
      this.filteredEmployeeList = [];

      // Clear all selected employees if departments are cleared
      // this.form.patchValue({ userIds: [] });
    }
  }

  removeEmployeesFromDeselectedDepartments(deselectedDepartmentIds: (number | undefined)[]): void {
    const currentUserIds = this.form.get('userIds')?.value || [];

    // Find employees that belong to deselected departments
    const employeesToRemove = this.employeeList
      .filter((emp) => deselectedDepartmentIds.includes(emp.departmentId))
      .map((emp) => emp.id);

    // Filter out employees from deselected departments
    const updatedUserIds = currentUserIds.filter(
      (userId: number) => !employeesToRemove.includes(userId)
    );

    this.form.patchValue({ userIds: updatedUserIds });
  }

  onEmployeeSelectionChange(userIds: number[] | null): void {
    if (userIds && userIds.length > 0) {
      console.log('employeeList', this.employeeList);
      // Get selected employees from the full list
      this.selectedEmployees = this.employeeList.filter((emp) => userIds.includes(emp.id || 0));
    } else {
      this.selectedEmployees = [];
    }

    // Update grouped employees by department
    this.updateDepartmentEmployeesGroups();
  }

  get optionLabel(): string {
    return this.currentLang === 'ar' ? 'nameAr' : 'nameEn';
  }

  updateDepartmentEmployeesGroups(): void {
    const groupsMap = new Map<number, DepartmentEmployees>();

    this.selectedEmployees.forEach((employee) => {
      const deptId = employee.departmentId;
      const department = this.departmentList.find((dept) => dept.id === deptId);

      if (department) {
        if (!groupsMap.has(deptId || 0)) {
          groupsMap.set(deptId || 0, {
            department: department,
            employees: [],
          });
        }
        groupsMap.get(deptId || 0)!.employees.push(employee);
      }
    });

    this.departmentEmployeesGroups = Array.from(groupsMap.values());
  }

  removeEmployee(employee: UsersWithDepartmentLookup): void {
    const currentUserIds = this.form.get('userIds')?.value || [];
    const updatedUserIds = currentUserIds.filter((id: number) => id !== employee.id);
    this.form.patchValue({ userIds: updatedUserIds });
  }

  removeAllEmployeesFromDepartment(departmentId: number | undefined): void {
    const currentUserIds = this.form.get('userIds')?.value || [];
    const employeesToRemove = this.selectedEmployees
      .filter((emp) => emp.departmentId === departmentId)
      .map((emp) => emp.id);

    const updatedUserIds = currentUserIds.filter((id: number) => !employeesToRemove.includes(id));
    this.form.patchValue({ userIds: updatedUserIds });
  }

  onProcessAllEmployeesChange(): void {
    const hasValues =
      (this.form.get('departmentIds')?.value?.length ?? 0) > 0 ||
      (this.form.get('userIds')?.value?.length ?? 0) > 0;

    if (this.processAllEmployees) {
      if (hasValues) {
        this.openConfirmation().subscribe((confirmed) => {
          if (confirmed) {
            this.resetFormForProcessAll();
          } else {
            // Revert the checkbox if user canceled
            this.processAllEmployees = false;
          }
        });
      } else {
        this.resetFormForProcessAll();
      }
    } else {
      // Clear selection
      this.form.get('departmentIds')?.enable();
      this.form.get('userIds')?.enable();
      this.form.patchValue({ userIds: [] });
    }
  }

  private resetFormForProcessAll(): void {
    const allUserIds = this.filteredEmployeeList.map((emp) => emp.id);

    this.form.patchValue({ userIds: [] });
    this.form.patchValue({ departmentIds: [] });
    this.form.get('departmentIds')?.disable();
    this.form.get('userIds')?.disable();
  }

  openConfirmation(): Observable<boolean> {
    const dialogRef = this.confirmationService.open({
      icon: 'warning',
      messages: [
        'ATTENDANCE_REPORT_PAGE.CONFIRM_PROCESS_ALL_EMPLOYEES',
        'ATTENDANCE_REPORT_PAGE.CONFIRM_PROCESS_ALL_EMPLOYEES_MESSAGE',
      ],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

    return dialogRef.afterClosed().pipe(map((result) => result === DIALOG_ENUM.OK));
  }

  resetForm(): void {
    this.form.reset();
    this.selectedEmployees = [];
    this.departmentEmployeesGroups = [];
    this.selectedDepartments = [];
    this.processAllEmployees = false;
    this.filteredEmployeeList = [];
    this.form.get('departmentIds')?.enable();
    this.form.get('userIds')?.enable();
  }

  processEmployees(): void {
    console.log('Form is valid', this.form);
    if (this.form.valid) {
      const formValue = this.form.value;
      console.log('Processing employees with data:', formValue);
      // Implement your processing logic here
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setHomeItem(): void {
    this.home = {
      label: this.translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }

  private initBreadcrumbs(): void {
    this.breadcrumbs = this.getBreadcrumbKeys().map((item) => ({
      label: this.translateService.instant(item.labelKey),
      icon: item.icon,
      routerLink: item.routerLink,
    }));
  }

  getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[] {
    return [{ labelKey: 'ATTENDANCE_REPORT_PAGE.EMPLOYEE_REPORTS_PROCESSING' }];
  }

  // Form control getters
  get dateFromControl(): FormControl {
    return this.form.get('dateFrom') as FormControl;
  }

  get dateToControl(): FormControl {
    return this.form.get('dateTo') as FormControl;
  }

  get userIdsControl(): FormControl {
    return this.form.get('userIds') as FormControl;
  }

  get departmentIdsControl(): FormControl {
    return this.form.get('departmentIds') as FormControl;
  }

  getSelectedEmployeesLabel() {
    const count = this.userIdsControl?.value?.length || 0;
    return this.translateService.instant('ATTENDANCE_REPORT_PAGE.SELECTED_EMPLOYEES') + ' ' + count;
  }

  getSelectedDepartmentsLabel() {
    const count = this.departmentIdsControl?.value?.length || 0;
    return (
      this.translateService.instant('ATTENDANCE_REPORT_PAGE.SELECTED_DEPARTMENTS') + ' ' + count
    );
  }
}
