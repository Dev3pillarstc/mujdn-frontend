import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { AddPermissionPopupComponent } from '../popups/add-permission-popup/add-permission-popup.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
  override breadcrumbs: MenuItem[] | undefined;
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
  filterModel: PermissionFilter = new PermissionFilter();
  viewMode = ViewModeEnum;
  translateService = inject(TranslateService);

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
    this.breadcrumbs = [{ label: this.translateService.instant('PERMISSION_PAGE.PERMISSIONS') }];
  }

  override openDialog(model: Permission, viewMode?: ViewModeEnum): void {
    const lookups = {
      permissionTypes: this.permissionTypes,
      prmissionReasons: this.prmissionReasons,
    };
    this.openBaseDialog(AddPermissionPopupComponent as any, model, viewMode!, lookups);
  }

  addOrEditModel(permission?: Permission) {
    const viewMode = permission ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    permission = permission || new Permission();
    this.openDialog(permission, viewMode);
  }

  protected override mapModelToExcelRow(model: Permission): { [key: string]: any } {
    return {
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_REASON')]:
        model.getPermissionReasonName(),
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_TYPE')]:
        model.getPermissionTypeName(),
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_DATE')]: model.permissionDate,
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_STATUS')]: model.getStatusName(),
    };
  }
  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }
  loadIncomingPermissions() {
    this.service
      .loadDepartmentPermissionPaginated(this.paginationParams, { ...this.filterModel! })
      .subscribe({
        next: (response) => {
          this.list = response.list || [];

          if (response.paginationInfo) {
            this.paginationInfoMap(response);
          } else {
            this.paginationInfo.totalItems = this.list.length;
          }
        },
        error: (_) => {
          this.list = [];
          this.paginationInfo.totalItems = 0;
        },
      });
  }
  clickIncomingPermissionTab() {
    this.filterModel = new PermissionFilter();
    this.activeTabIndex == PERMISSION_TABS_ENUM.MY_PERMISSIONS && this.loadIncomingPermissions();
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
    this.loadIncomingPermissions();
  }
  departmentPermissionResetSearch() {
    this.filterModel = new PermissionFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadIncomingPermissions();
  }
  openDataDialog(model: Permission, canTakeAction?: ViewModeEnum): void {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model: model, ViewMode: canTakeAction };
    const dialogRef = this.matDialog.open(PermissionsDataPopupComponent as any, dialogConfig);

    dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.loadIncomingPermissions();
      }
    });
  }

  showIncomingPermissions() {
    return (
      this.authService.isSecurityLeader ||
      this.authService.isDepartmentManager ||
      this.authService.isHROfficer
    );
  }
  showAddingPermissionButton(): boolean {
    const isManagerOfRoot =
      this.authService.isDeprtmentActualManager && this.authService.isRootDeprtment;
    return !isManagerOfRoot;
  }

  onIncomingPermissionPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadIncomingPermissions();
  }
}
