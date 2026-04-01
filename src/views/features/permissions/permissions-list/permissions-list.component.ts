import { Component, inject, OnInit } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
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
import { PERMISSION_TABS_ENUM } from '@/enums/permission-tabs-enum';
import { CustomValidators } from '@/validators/custom-validators';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../../public/assets/fonts/ibm-plex-font';
import { AuthService } from '@/services/auth/auth.service';

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
    maxWidth: '800px',
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
  isIncomingPermissions: boolean = false;
  authService = inject(AuthService);

  override get service() {
    return this.permissionService;
  }

  override initListComponent(): void {
    this.permissionTypeService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.permissionTypes = res;
    });
    this.userService.getMyDepartmentsLookup().subscribe((res: BaseLookupModel[]) => {
      this.departments = res;
    });
    this.prmissionStatusService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.prmissionStatuses = res;
    });
    this.userService.getMyDepartmentUsersLookup().subscribe((res: BaseLookupModel[]) => {
      this.users = res;
    });
    this.prmissionReasonService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.prmissionReasons = res;
    });
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

  mapIncomingRequestsToExcelRow(model: Permission): { [key: string]: any } {
    return {
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_TYPE')]:
        model.getPermissionTypeName(),
      [this.translateService.instant('EMPLOYEES_PAGE.EMPLOYEE_NAME')]: model.getCreationUserName(),
      [this.translateService.instant('DEPARTMENTS_HEADER_PAGE.DEPARTMENT_NAME')]:
        model.getPermissionDepartmentName(),
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_DATE')]: model.permissionDate,
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_REASON')]:
        model.getPermissionReasonName(),
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_STATUS')]: model.getStatusName(),
    };
  }
  protected override mapModelToPdfRow(model: Permission): { [key: string]: any } {
    return this.mapModelToExcelRow(model);
  }

  protected override getPdfTitle(): { ar: string; en: string } {
    return {
      ar: 'قائمة الاذونات',
      en: 'Permissions List',
    };
  }

override exportPdf(
  fileName: string = 'permissions.pdf',
  isIncomingPermissions: boolean = false
): void {
  const allDataParams = {
    ...this.paginationParams,
    pageNumber: 1,
    pageSize: CustomValidators.defaultLengths.INT_MAX,
  };

  const fetchAll = isIncomingPermissions
    ? this.service.loadDepartmentPermissionPaginated(allDataParams, {
        ...this.appliedFilterModel!,
      })
    : this.service.loadPaginated(allDataParams, { ...this.appliedFilterModel! });

  const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;

  fetchAll.subscribe({
    next: (response) => {
      const fullList = response.list || [];
      if (fullList.length === 0) {
        this.alertsService.showErrorMessage({ messages: ['COMMON.NO_DATA_TO_EXPORT'] });
        return;
      }

      const transformedData = fullList.map((item) => this.mapModelToPdfRow(item));

      const formatCell = (val: any): string | number => {
        if (val instanceof Date) return val.toLocaleString();
        return val != null ? val : '';
      };

      const rawHead = Object.keys(transformedData[0]);
      const head    = isRTL ? [[...rawHead].reverse()] : [rawHead];
      const body    = transformedData.map((row) => {
        const values = Object.values(row).map(formatCell);
        return isRTL ? [...values].reverse() : values;
      });

      const HEADER_BG          : [number, number, number] = [243, 244, 246];
      const HEADER_TEXT        : [number, number, number] = [51,  65,  85 ];
      const ROW                : [number, number, number] = [255, 255, 255];
      const HEADER_BORDER_COLOR: [number, number, number] = [226, 232, 240];
      const BODY_TEXT          : [number, number, number] = [51,  51,  51 ];

      const doc      = new jsPDF({ orientation: 'landscape', format: 'a4' });
      registerIBMPlexArabicFont(doc);

      const pageWidth = doc.internal.pageSize.getWidth();
      const colCount  = head[0].length;
      const usableW   = pageWidth - 20;
      const colWidth  = usableW / colCount;

      const columnStyles: { [key: number]: any } = {};
      for (let i = 0; i < colCount; i++) {
        columnStyles[i] = { cellWidth: colWidth, halign: 'center', valign: 'middle' };
      }

      const titles = this.getPdfTitle();

      autoTable(doc, {
        head,
        body,
        styles: {
          font        : 'IBMPlexSansArabic',
          fontStyle   : 'normal',
          fontSize    : 9,
          halign      : 'center',
          valign      : 'middle',
          textColor   : BODY_TEXT,
          lineWidth   : 0,
          cellPadding : 4,
        },
        headStyles: {
          font          : 'IBMPlexSansArabic',
          fontStyle     : 'normal',
          fontSize      : 9,
          halign        : 'center',
          valign        : 'middle',
          fillColor     : HEADER_BG,
          textColor     : HEADER_TEXT,
          lineColor     : HEADER_BORDER_COLOR,
          lineWidth     : 0.25,
          cellPadding   : 5,
          minCellHeight : 12,
        },
        bodyStyles        : { fillColor: ROW },
        alternateRowStyles: { fillColor: ROW },
        margin            : { top: 18, right: 10, bottom: 10, left: 10 },
        columnStyles,
        tableWidth        : 'auto',

didParseCell: (data) => {
  if (data.section === 'body') {
    // bottom border only on body cells
    data.cell.styles.lineWidth = { top: 0, right: 0, bottom: 0.3, left: 0 } as any;
    data.cell.styles.lineColor = [226, 232, 240] as any;
  } else if (data.section === 'head') {
    // full border on header cells
    data.cell.styles.lineWidth = 0.25;
    data.cell.styles.lineColor = [226, 232, 240] as any;
  }
},

        didDrawPage: (data) => {
          const title = isRTL ? titles.ar : titles.en;
          doc.setFont('IBMPlexSansArabic');
          doc.setFontSize(11);
          doc.setTextColor(45, 156, 156);
          if (isRTL) {
            doc.text(title, pageWidth - 10, 12, { align: 'right' });
          } else {
            doc.text(title, 10, 12, { align: 'left' });
          }
          doc.setDrawColor(45, 156, 156);
          doc.setLineWidth(0.5);
          doc.line(10, 14, pageWidth - 10, 14);
        },
      });

      // ── Outer border using lastAutoTable ────────────────────────────────
      const last = (doc as any).lastAutoTable;

      if (last) {
        const marginLeft  = (last.settings?.margin?.left  ?? 10) as number;
        const marginRight = (last.settings?.margin?.right ?? 10) as number;
        const startY      = (last.startY  ?? last.settings?.margin?.top ?? 18) as number;
        const finalY      = (last.finalY  ?? startY) as number;
        const tableW      = pageWidth - marginLeft - marginRight;
        const tableH      = finalY - startY;

        if (tableW > 0 && tableH > 0) {
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.4);
          doc.rect(marginLeft, startY, tableW, tableH);
        }
      }

      doc.save(fileName);
    },

    error: (_) => {
      this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
    },
  });
}
  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }

  loadIncomingPermissions() {
    this.service
      .loadDepartmentPermissionPaginated(this.paginationParams, { ...this.appliedFilterModel! })
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
    this.isIncomingPermissions = true;
    this.filterModel = new PermissionFilter();
    this.activeTabIndex == PERMISSION_TABS_ENUM.MY_PERMISSIONS && this.loadIncomingPermissions();
    this.activeTabIndex = PERMISSION_TABS_ENUM.INCOMING_PERMISSIONS;
  }

  clickMyPermissionTab() {
    if (this.activeTabIndex == PERMISSION_TABS_ENUM.INCOMING_PERMISSIONS) {
      this.resetSearch();
    }
    this.activeTabIndex = PERMISSION_TABS_ENUM.MY_PERMISSIONS;
  }

  departmentPermissionSearch() {
    this.appliedFilterModel = { ...this.filterModel };
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadIncomingPermissions();
  }

  departmentPermissionResetSearch() {
    this.filterModel = new PermissionFilter();
    this.appliedFilterModel = new PermissionFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadIncomingPermissions();
  }

  openDataDialog(model: Permission, canTakeAction?: ViewModeEnum): void {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    dialogConfig.data = { model: model, ViewMode: canTakeAction };
    const dialogRef = this.matDialog.open(PermissionsDataPopupComponent as any, dialogConfig);

    dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.loadIncomingPermissions();
      }
    });
  }

  showIncomingPermissions() {
    return this.authService.isDepartmentManager || this.authService.isHROfficer;
  }

  showAddingPermissionButton(): boolean {
    const isManagerOfRoot =
      this.authService.isdepartmentActualManager && this.authService.isRootdepartment;
    return !isManagerOfRoot;
  }

  onIncomingPermissionPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadIncomingPermissions();
  }

  override exportExcel(
    fileName: string = 'data.xlsx',
    isIncomingPermissions: boolean = false
  ): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = isIncomingPermissions
      ? this.service.loadDepartmentPermissionPaginated(allDataParams, {
          ...this.appliedFilterModel!,
        })
      : this.service.loadPaginated(allDataParams, { ...this.appliedFilterModel! });

    fetchAll.subscribe({
      next: (response) => {
        const fullList = response.list || [];
        if (fullList.length === 0) {
          this.alertsService.showErrorMessage({ messages: ['COMMON.NO_DATA_TO_EXPORT'] });
          return;
        } else {
          const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;
          const transformedData = fullList.map((item) =>
            isIncomingPermissions
              ? this.mapIncomingRequestsToExcelRow(item)
              : this.mapModelToExcelRow(item)
          );
          const ws = XLSX.utils.json_to_sheet(transformedData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          wb.Workbook = { Views: [{ RTL: isRTL }] };
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, fileName);
        }
      },
      error: (_) => {
        this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
      },
    });
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'PERMISSION_PAGE.PERMISSIONS' }];
  }

  protected override mapModelToExcelRow(model: Permission): { [key: string]: any } {
    return {
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_TYPE')]:
        model.getPermissionTypeName(),
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_DATE')]: model.permissionDate,
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_REASON')]:
        model.getPermissionReasonName(),
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_STATUS')]: model.getStatusName(),
    };
  }
}
