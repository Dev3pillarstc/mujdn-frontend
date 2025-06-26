import { DepartmentPopupComponent } from '../department-popup/department-popup.component';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DepartmentHeaderComponent } from '../department-header/department-header.component';
import { DepartmentTreeComponent } from '../department-tree/department-tree.component';
import { Department } from '@/models/features/lookups/Department/department';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DepartmentService } from '@/services/features/lookups/department.service';
import DepartmentFilter from '@/models/features/lookups/Department/department-filter';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { TranslatePipe } from '@ngx-translate/core';
import { Region } from '@/models/features/lookups/region/region';
import { City } from '@/models/features/lookups/City/city';
import { CityService } from '@/services/features/lookups/city.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { AlertService } from '@/services/shared/alert.service';
import { ConfirmationService } from '@/services/shared/confirmation.service';
import { UserProfilesLookop } from '@/models/auth/users-profiles-lookup';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-department-list',
  imports: [
    Breadcrumb,
    FormsModule,
    DatePickerModule,
    FluidModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    InputTextModule,
    Select,
    DepartmentHeaderComponent,
    DepartmentTreeComponent,
    TranslatePipe,
  ],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export default class DepartmentListComponent extends BaseListComponent<
  Department,
  DepartmentPopupComponent,
  DepartmentService,
  DepartmentFilter
> {
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  private _filterModel: DepartmentFilter = new DepartmentFilter();
  private _selectedDepartment: Department | null = null;

  home: MenuItem | undefined;
  date2: Date | undefined;
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  departmentsTree: Department[] = [];
  regions: BaseLookupModel[] = [];
  cities: City[] = [];
  usersProfiles: UserProfilesLookop[] = [];
  filteredCities: City[] = [];
  childDepartments: PaginatedList<Department> = new PaginatedList<Department>();

  languageService = inject(LanguageService);
  departmentService = inject(DepartmentService);
  // cityService = inject(CityService);
  confirmationService = inject(ConfirmationService);
  alertService = inject(AlertService);
  selectedDepartmentSignal = signal<Department | null>(null);

  initListComponent(): void {
    this.departmentsTree = this.activatedRoute.snapshot.data['list'].departmentsTree.data;
    this.regions = this.activatedRoute.snapshot.data['list'].regions;
    this.cities = this.activatedRoute.snapshot.data['list'].cities;
    this.usersProfiles = this.activatedRoute.snapshot.data['list'].users.data;

    // Set the grandparent department in the signal
    const rootDepartment = this.departmentsTree.find(
      (dept: Department) => dept.fkParentDepartmentId == null
    );
    this.selectedDepartmentSignal.set(rootDepartment || null);

    // Explicitly set the selectedDepartment property
    this.selectedDepartment = rootDepartment || null;

    this.childDepartments = this.activatedRoute.snapshot.data['list'].childDepartments;
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الأقسام' }];
    this.initializeFilteredCities();
  }
  initializeFilteredCities(): void {
    const currentRegionId = this.filterModel.fkRegionId;
    console.log('currentRegionId', currentRegionId);
    if (currentRegionId) {
      this.filteredCities = this.cities.filter((city) => city.fkRegionId === currentRegionId);
    } else {
      this.filteredCities = [];
    }
    console.log('this.filteredCities', this.cities);
  }
  openConfirmation(departmentId: number | undefined) {
    const dialogRef = this.confirmationService.open({
      icon: 'warning',
      messages: ['COMMON.CONFIRM_DELETE'],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == DIALOG_ENUM.OK) {
        this.delete(departmentId);
        // User confirmed
        this.alertService.showSuccessMessage({ messages: ['COMMON.DELETED_SUCCESSFULLY'] });
      } else {
        // User canceled
        this.alertService.showErrorMessage({ messages: ['COMMON.DELETION_FAILED'] });
      }
    });
  }
  protected override mapModelToExcelRow(model: Department): { [key: string]: any } {
    const lang = this.languageService.getCurrentLanguage(); // 'ar' or 'en'
    return {
      [lang === LANGUAGE_ENUM.ARABIC ? 'الإدارة' : 'Department']:
        lang === LANGUAGE_ENUM.ARABIC ? model.nameAr : model.nameEn,
    };
  }

  override get filterModel(): DepartmentFilter {
    return this._filterModel;
  }

  override set filterModel(val: DepartmentFilter) {
    this._filterModel = val;
    this._filterModel.fkParentDepartmentId = this.selectedDepartment?.id;
  }

  get selectedDepartment(): Department | null {
    return this._selectedDepartment;
  }

  set selectedDepartment(val: Department | null) {
    this._selectedDepartment = val;
    this.filterModel.fkParentDepartmentId = val?.id;
  }
  onSelectedDepartmentChange(event: Department) {
    this.selectedDepartmentSignal.set(event);
    this.selectedDepartment = event;

    // Call and assign new child departments
    this.loadChildDepartmentsAfterSelect();
  }

  loadChildDepartmentsAfterSelect() {
    this.service.loadPaginated(this.paginationParams, { ...this.filterModel! }).subscribe({
      next: (response) => {
        this.childDepartments = response;
      },
      error: (_) => {
        this.childDepartments = new PaginatedList<Department>();
      },
    });
  }
  override onPageChange(event: PaginatorState): void {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadChildDepartmentsAfterSelect();
  }
  override get service(): DepartmentService {
    return this.departmentService;
  }

  override openDialog(department: Department) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    let lookups = {
      cities: this.cities,
      regions: this.regions,
      usersProfiles: this.usersProfiles,
    };
    const viewMode = department ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    dialogConfig.data = { model: department, lookups: lookups, viewMode: viewMode };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(DepartmentPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.onDepartmentChange();
      }
    });
  }
  addOrEditModel(parentDepartmentId?: number, department?: Department): void {
    const departmentCopy = department ? new Department().clone(department) : new Department();
    // Only set fkParentDepartmentId if adding (not editing)
    if (!department) {
      departmentCopy.fkParentDepartmentId = parentDepartmentId;
    }
    this.openDialog(departmentCopy);
  }
  delete(departmentId: number | undefined): void {
    if (!departmentId) return;

    this.departmentService.delete(departmentId).subscribe({
      next: () => {
        this.onDepartmentChange();
      },
      error: (err) => {},
    });
  }
  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }
  onDepartmentChange() {
    // this.loadList();
    this.loadChildDepartmentsAfterSelect();
    this.loadDepartmentsTree(); // Add this line
  }
  loadDepartmentsTree() {
    this.departmentService.getDepartmentTreeAsync().subscribe((tree) => {
      this.departmentsTree = tree.data;
    });
  }
  override search() {
    this.loadChildDepartmentsAfterSelect();
  }
  override resetSearch() {
    this.filterModel = new DepartmentFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadChildDepartmentsAfterSelect();
  }
  getApprovalLevelText(isOneLevelVerification: boolean): string {
    return isOneLevelVerification
      ? 'DEPARTMENTS_PAGE.ONE_LEVEL_APPROVAL'
      : 'DEPARTMENTS_PAGE.TWO_LEVEL_APPROVAL';
  }
}
