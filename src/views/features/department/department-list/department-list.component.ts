import { DepartmentPopupComponent } from '../department-popup/department-popup.component';
import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DepartmentHeaderComponent } from '../department-header/department-header.component';
import { DepartmentTreeComponent } from '../department-tree/department-tree.component';
import { Department } from '@/models/features/lookups/department/department';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DepartmentService } from '@/services/features/lookups/department.service';
import DepartmentFilter from '@/models/features/lookups/department/department-filter';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';

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
  languageService = inject(LanguageService);
  departmentService = inject(DepartmentService);
  home: MenuItem | undefined;
  date2: Date | undefined;
  attendance!: any[];
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;

  private _filterModel: DepartmentFilter = new DepartmentFilter();

  override get filterModel(): DepartmentFilter {
    return this._filterModel;
  }

  override set filterModel(val: DepartmentFilter) {
    this._filterModel = val;
    this._filterModel.fkParentDepartmentId = this.selectedDepartment?.id;
  }

  private _selectedDepartment: Department | null = null;

  get selectedDepartment(): Department | null {
    return this._selectedDepartment;
  }

  set selectedDepartment(val: Department | null) {
    this._selectedDepartment = val;
    this.filterModel.fkParentDepartmentId = val?.id;
  }

  override get service(): DepartmentService {
    return this.departmentService;
  }

  override initListComponent(): void {}

  onSelectedDepamentChange(event: any) {
    this.selectedDepartment = event;
    this.loadList();
  }

  openDialog() {
    const dialogRef = this.matDialog.open(DepartmentPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });
  }

  override onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  override search(): void {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadList();
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  protected override mapModelToExcelRow(model: Department): { [key: string]: any } {
    const lang = this.languageService.getCurrentLanguage(); // 'ar' or 'en'
    return {
      [lang === LANGUAGE_ENUM.ARABIC ? 'الإدارة' : 'Department']:
        lang === LANGUAGE_ENUM.ARABIC ? model.nameAr : model.nameEn,
    };
  }
}
