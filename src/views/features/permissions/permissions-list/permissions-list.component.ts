import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { AddPermissionPopupComponent } from '../popups/add-permission-popup/add-permission-popup.component';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { Permission } from '@/models/features/lookups/permission/permission';
import { PermissionFilter } from '@/models/features/lookups/permission/permission-filter';
import { PermissionService } from '@/services/features/lookups/permission.service';
import { LanguageService } from '@/services/shared/language.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { Select } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { PermissionTypeService } from '@/services/features/lookups/permission-type.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { PermissionStatusService } from '@/services/features/lookups/permission-status.service';
import { UserService } from '@/services/features/user.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';
import { PermissionsDataPopupComponent } from '../popups/permissions-data-popup/permissions-data-popup.component';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { MatDialogConfig } from '@angular/material/dialog';
import { PERMISSION_STATUS_ENUM } from '@/enums/permission-status-enum';
import { AuthService } from '@/services/auth/auth.service';
import { PERMISSION_TABS_ENUM } from '@/enums/permission-tabs-enum';

@Component({
  selector: 'app-permissions-list',
  imports: [
    Breadcrumb,
    FormsModule,
    Select,
    DatePickerModule,
    FluidModule,
    TableModule,
    CommonModule,
    RouterModule,
    PaginatorModule,
    TabsModule,
    InputTextModule,
    TranslatePipe,
  ],

  templateUrl: './permissions-list.component.html',
  styleUrl: './permissions-list.component.scss',
})
export default class PermissionsListComponent
  extends BaseListComponent<
    Permission,
    AddPermissionPopupComponent,
    PermissionService,
    PermissionFilter
  >
  implements OnInit
{
  activeTabIndex = 0;
  languageService = inject(LanguageService); // Assuming you have a LanguageService to handle language changes
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  permissionService = inject(PermissionService);
  permissionTypeService = inject(PermissionTypeService);
  departmentService = inject(DepartmentService);
  prmissionStatusService = inject(PermissionStatusService);
  prmissionReasonService = inject(PermissionReasonService);
  userService = inject(UserService);
  permissionStatusEnum = PERMISSION_STATUS_ENUM;
  permissionTypes: BaseLookupModel[] = [];
  departments: BaseLookupModel[] = [];
  users: BaseLookupModel[] = [];
  prmissionStatuses: BaseLookupModel[] = [];
  prmissionReasons: BaseLookupModel[] = [];
  home: MenuItem | undefined;
  filterModel: PermissionFilter = new PermissionFilter();
  viewMode = ViewModeEnum;
  override get service() {
    return this.permissionService;
  }
  authService = inject(AuthService);

  override initListComponent(): void {
    this.permissionTypeService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.permissionTypes = res;
    });
    this.departmentService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.departments = res;
    });
    this.prmissionStatusService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.prmissionStatuses = res;
    });
    this.userService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.users = res;
    });
    this.prmissionReasonService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.prmissionReasons = res;
    });
  }

  override openDialog(model: Permission): void {
    const lookups = {
      permissionTypes: this.permissionTypes,
      prmissionReasons: this.prmissionReasons,
    };

    const viewMode = model ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(AddPermissionPopupComponent as any, model, viewMode, lookups);
  }

  addOrEditModel(permission?: Permission) {
    permission = permission || new Permission();
    this.openDialog(permission);
  }

  protected override mapModelToExcelRow(model: Permission): { [key: string]: any } {
    const lang = this.languageService.getCurrentLanguage(); // 'ar' or 'en'

    return {
      [lang === LANGUAGE_ENUM.ARABIC ? 'سبب الإذن' : 'Permission Reason']:
        lang === LANGUAGE_ENUM.ARABIC
          ? model.permissionReason.nameAr
          : model.permissionReason.nameEn,
      [lang === LANGUAGE_ENUM.ARABIC ? 'نوع الإذن' : 'Permission Type']:
        lang === LANGUAGE_ENUM.ARABIC ? model.permissionType.nameAr : model.permissionType.nameEn,
      [lang === LANGUAGE_ENUM.ARABIC ? 'تاريخ الإذن' : 'Permission Type']:
        lang === LANGUAGE_ENUM.ARABIC ? model.permissionType.nameAr : model.permissionType.nameEn,
    };
  }
  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }
  getDepartmentPermissions() {
    this.service
      .loadDepartmentPermissionPaginated(this.paginationParams, { ...this.filterModel! })
      .subscribe((res) => {
        this.list = res.list;
      });
  }
  clickIncomingPermissionTab() {
    this.filterModel = new PermissionFilter();
    this.activeTabIndex == PERMISSION_TABS_ENUM.MY_PERMISSIONS && this.getDepartmentPermissions();
    this.activeTabIndex = PERMISSION_TABS_ENUM.INCOMING_PERMISSIONS;
  }
  clickMyPermissionTab() {
    this.filterModel = new PermissionFilter();
    this.activeTabIndex == PERMISSION_TABS_ENUM.INCOMING_PERMISSIONS && this.loadList();
    this.activeTabIndex = PERMISSION_TABS_ENUM.MY_PERMISSIONS;
  }
  departmentPermissionSearch() {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.getDepartmentPermissions();
  }
  departmentPermissionResetSearch() {
    this.filterModel = new PermissionFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.getDepartmentPermissions();
  }
  openDataDialog(model: Permission, canTakeAction?: ViewModeEnum): void {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model: model, ViewMode: canTakeAction };
    const dialogRef = this.matDialog.open(PermissionsDataPopupComponent as any, dialogConfig);

    dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.getDepartmentPermissions();
      }
    });
  }

  showIncomingPermissions() {
    return (
      this.authService.isAdmin ||
      this.authService.isDepartmentManager ||
      this.authService.isHROfficer
    );
  }
}
