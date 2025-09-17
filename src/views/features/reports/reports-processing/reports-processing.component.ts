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
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '@/services/shared/language.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserService } from '@/services/features/user.service';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { Department } from '@/models/features/lookups/department/department';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { ManualProcessing } from '@/models/features/business/manual-processing';
import { ManualProcessingService } from '@/services/features/business/manual-processing.service';
import { AlertService } from '@/services/shared/alert.service';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

interface SelectedDepartment {
  departmentId: number | undefined;
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
  ],
  templateUrl: './reports-processing.component.html',
  styleUrl: './reports-processing.component.scss',
})
export default class ReportsProcessingComponent implements OnInit, OnDestroy {
  // Injected services
  translateService = inject(TranslateService);
  langService = inject(LanguageService);
  activatedRoute = inject(ActivatedRoute);
  departmentService = inject(DepartmentService);
  userService = inject(UserService);
  manualProcessingService = inject(ManualProcessingService);
  alertService = inject(AlertService);
  fb = inject(FormBuilder);

  // Component properties
  destroy$: Subject<void> = new Subject<void>();
  form!: FormGroup;
  model: ManualProcessing = new ManualProcessing();

  // Lookup data
  departmentList: BaseLookupModel[] = [];
  employeeList: UsersWithDepartmentLookup[] = [];
  filteredEmployees: UsersWithDepartmentLookup[] = [];

  // Selection state
  selectedDepartmentId: number | undefined;
  selectedEmployeeId: number | undefined;
  selectedDepartments: SelectedDepartment[] = [];
  selectedEmployeeIds: number[] = [];

  // Breadcrumb properties
  breadcrumbs: MenuItem[] = [];
  home = {
    label: this.translateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home',
  };

  // Current language
  currentLang = 'ar';
  direction = 'rtl';

  get langOptionLabel(): string {
    return this.currentLang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  ngOnInit() {
    this.initializeComponent();
    this.buildForm();
    this.setHomeItem();
    this.initBreadcrumbs();
    this.loadLookups();
    this.subscribeToLanguageChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.currentLang =
      this.langService.getCurrentLanguage() || this.translateService.currentLang || 'ar';
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  private buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
  }

  private subscribeToLanguageChanges(): void {
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((langChangeEvent) => {
        this.currentLang = langChangeEvent.lang;
        this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        this.setHomeItem();
        this.initBreadcrumbs();
      });

    this.langService.languageChanged$.pipe(takeUntil(this.destroy$)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.direction = lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  private loadLookups(): void {
    this.departmentService.getLookup().subscribe({
      next: (res: BaseLookupModel[]) => {
        this.departmentList = res;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.alertService.showErrorMessage({ messages: ['COMMON.ERROR_LOADING_DATA'] });
      },
    });

    this.userService.getUsersWithDepartment().subscribe({
      next: (res: UsersWithDepartmentLookup[]) => {
        this.employeeList = res;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.alertService.showErrorMessage({ messages: ['COMMON.ERROR_LOADING_DATA'] });
      },
    });
  }

  onDepartmentChange(event: any): void {
    this.selectedEmployeeId = undefined;

    if (this.selectedDepartmentId) {
      // Filter employees by selected department
      this.filteredEmployees = this.employeeList.filter(
        (emp) => emp.departmentId === this.selectedDepartmentId
      );
    } else {
      // Clear filtered employees if no department selected
      this.filteredEmployees = [];
    }
  }

  onEmployeeSelect(event: any): void {
    if (!this.selectedEmployeeId || !this.selectedDepartmentId) return;

    const employee = this.employeeList.find((emp) => emp.id === this.selectedEmployeeId);
    if (!employee) return;

    // Check if department already exists in selected departments
    let department = this.selectedDepartments.find(
      (dept) => dept.departmentId === this.selectedDepartmentId
    );

    if (!department) {
      // Create new department entry
      department = {
        departmentId: this.selectedDepartmentId,
        employees: [],
      };
      this.selectedDepartments.push(department);
    }

    // Check if employee already exists in department
    const employeeExists = department.employees.some((emp) => emp.id === employee.id);
    if (!employeeExists) {
      department.employees.push(employee);
      this.updateSelectedEmployeeIds();
    }

    // Reset employee selection
    this.selectedEmployeeId = undefined;
  }

  removeEmployee(departmentId: number, employeeId: number): void {
    const department = this.selectedDepartments.find((dept) => dept.departmentId === departmentId);
    if (!department) return;

    // Remove employee from department
    department.employees = department.employees.filter((emp) => emp.id !== employeeId);

    // If department has no employees, remove it
    if (department.employees.length === 0) {
      this.selectedDepartments = this.selectedDepartments.filter(
        (dept) => dept.departmentId !== departmentId
      );
    }

    this.updateSelectedEmployeeIds();
  }

  deleteAllEmployees(): void {
    this.selectedDepartments = [];
    this.selectedEmployeeIds = [];
    this.selectedDepartmentId = undefined;
    this.selectedEmployeeId = undefined;
    this.filteredEmployees = [];
  }

  private updateSelectedEmployeeIds(): void {
    this.selectedEmployeeIds = [];
    this.selectedDepartments.forEach((dept) => {
      dept.employees.forEach((emp) => {
        if (emp.id) {
          this.selectedEmployeeIds.push(emp.id);
        }
      });
    });
  }

  processSelectedEmployees(): void {
    if (!this.isFormValid() || this.selectedEmployeeIds.length === 0) return;

    const model: ManualProcessing = {
      ...this.form.value,
      userIds: this.selectedEmployeeIds,
    };

    this.manualProcessingService.excuteManualProcessing(model).subscribe({
      next: (response: string) => {
        this.alertService.showSuccessMessage({
          messages: ['ATTENDANCE_REPORT_PAGE.PROCESSING_STARTED_SUCCESSFULLY'],
        });
        this.resetForm();
      },
      error: (error) => {
        console.error('Error processing employees:', error);
        this.alertService.showErrorMessage({
          messages: ['ATTENDANCE_REPORT_PAGE.ERROR_PROCESSING_EMPLOYEES'],
        });
      },
    });
  }

  processAllEmployees(): void {
    if (!this.isFormValid()) return;

    const model: ManualProcessing = {
      ...this.form.value,
      userIds: [], // Empty array for all employees
    };

    this.manualProcessingService.excuteManualProcessing(model).subscribe({
      next: (response: string) => {
        this.alertService.showSuccessMessage({
          messages: ['ATTENDANCE_REPORT_PAGE.ALL_EMPLOYEES_PROCESSING_STARTED'],
        });
        this.resetForm();
        this.deleteAllEmployees(); // Reset all selections
      },
      error: (error) => {
        console.error('Error processing all employees:', error);
        this.alertService.showErrorMessage({
          messages: ['ATTENDANCE_REPORT_PAGE.ERROR_PROCESSING_EMPLOYEES'],
        });
      },
    });
  }

  resetForm(): void {
    this.deleteAllEmployees();
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  getDepartmentName(departmentId: number | undefined): string {
    if (!departmentId) return '';

    const department = this.departmentList.find((dept) => dept.id === departmentId);
    if (!department) return '';

    return this.currentLang === 'ar' ? department.nameAr || '' : department.nameEn || '';
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
}
