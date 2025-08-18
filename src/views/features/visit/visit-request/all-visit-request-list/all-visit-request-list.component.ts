import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { QrcodeVisitRequestPopupComponent } from '../qrcode-visit-request-popup/qrcode-visit-request-popup.component';
import { Select } from 'primeng/select';
import { AddEditVisitRequestPopupComponent } from '../add-edit-visit-request-popup/add-edit-visit-request-popup.component';
import { ViewActionVisitRequestPopupComponent } from '../view-action-visit-request-popup/view-action-visit-request-popup.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Visit } from '@/models/features/visit/visit';
import { VisitService } from '@/services/features/visit/visit.service';
import { VisitFilter } from '@/models/features/visit/visit-filter';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { takeUntil } from 'rxjs';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { VisitStatusEnum } from '@/enums/visit-status-enum';
import { formatTimeTo12Hour } from '@/utils/general-helper';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';

@Component({
  selector: 'app-all-visit-request-list',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    TabsModule,
    Select,
    DatePicker,
    TranslatePipe,
  ],
  templateUrl: './all-visit-request-list.component.html',
  styleUrl: './all-visit-request-list.component.scss',
})
export class AllVisitRequestListComponent
  extends BaseListComponent<Visit, AddEditVisitRequestPopupComponent, VisitService, VisitFilter>
  implements OnInit, OnChanges
{
  @Input() isActive: boolean = false;
  @Input() departments: BaseLookupModel[] = [];
  @Input() nationalities: BaseLookupModel[] = [];

  override filterModel: VisitFilter = new VisitFilter();
  visitService = inject(VisitService);
  languageService = inject(LanguageService);
  departmentService = inject(DepartmentService);

  private hasInitialized = false;

  visitStatusOptions: { label: string; value: number }[] = [];
  visitCreatorOptions: { label: string; value: number }[] = [];

  // Enum reference for template
  VisitStatusEnum = VisitStatusEnum;

  override get service(): VisitService {
    return this.visitService;
  }

  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  dialogSize2 = {
    width: '100%',
    maxWidth: '1024px',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive']) {
      const current = changes['isActive'].currentValue;
      const previous = changes['isActive'].previousValue;

      // Skip first trigger after component init
      if (!this.hasInitialized) {
        this.hasInitialized = true;
        return;
      }

      // Only load data if tab is active and this is not the initial change
      if (current && !previous) {
        this.loadDataIfNeeded();
      }
    }
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    return formatTimeTo12Hour(timeString, locale);
  }

  private initializeVisitStatusOptions(): void {
    this.visitStatusOptions = [
      {
        label: this.translateService.instant('VISIT_REQUEST_PAGE.NEW'),
        value: VisitStatusEnum.NEW,
      },
      {
        label: this.translateService.instant('VISIT_REQUEST_PAGE.APPROVED'),
        value: VisitStatusEnum.APPROVED,
      },
      {
        label: this.translateService.instant('VISIT_REQUEST_PAGE.REJECTED'),
        value: VisitStatusEnum.REJECTED,
      },
    ];
  }

  private initializeVisitCreatorOptions(): void {
    // Add your visit origin options here based on your requirements
    this.visitCreatorOptions = [
      {
        label: this.translateService.instant('VISIT_REQUEST_PAGE.INTERNAL'),
        value: 1,
      },
      {
        label: this.translateService.instant('VISIT_REQUEST_PAGE.EXTERNAL'),
        value: 2,
      },
    ];
  }

  private loadDataIfNeeded(): void {
    // Load data when tab becomes active
    this.loadList().subscribe({
      next: (response) => this.handleLoadListSuccess(response),
      error: this.handleLoadListError,
    });
  }

  // Status badge methods
  getStatusBadgeClass(status: number): string {
    switch (status) {
      case VisitStatusEnum.NEW:
        return 'text-[14px] text-[#1849a9] px-2 py-1 w-fit inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#eff8ff] font-medium';
      case VisitStatusEnum.APPROVED:
        return 'text-[14px] text-[#085d3a] min-w-[101px] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#ecfdf3] font-medium';
      case VisitStatusEnum.REJECTED:
        return 'text-[14px] text-[#912018] min-w-[101px] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#fef3f2] font-medium';
      default:
        return 'text-[14px] text-gray-600 px-2 py-1 rounded-full bg-gray-100 font-medium';
    }
  }

  getStatusBadgeDotClass(status: number): string {
    switch (status) {
      case VisitStatusEnum.NEW:
        return 'w-[10px] h-[10px] bg-[#1849a9] rounded-full';
      case VisitStatusEnum.APPROVED:
        return 'w-[10px] h-[10px] bg-[#085d3a] rounded-full';
      case VisitStatusEnum.REJECTED:
        return 'w-[10px] h-[10px] bg-[#912018] rounded-full';
      default:
        return 'w-[10px] h-[10px] bg-gray-600 rounded-full';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case VisitStatusEnum.NEW:
        return this.translateService.instant('VISIT_REQUEST_PAGE.NEW');
      case VisitStatusEnum.APPROVED:
        return this.translateService.instant('VISIT_REQUEST_PAGE.ACCEPTED');
      case VisitStatusEnum.REJECTED:
        return this.translateService.instant('VISIT_REQUEST_PAGE.REJECTED');
      default:
        return '';
    }
  }

  // Department name display
  getDepartmentName(visit: Visit): string {
    if (this.isCurrentLanguageEnglish()) {
      return visit.targetDepartment?.nameEn || '';
    }
    return visit.targetDepartment?.nameAr || '';
  }

  override initListComponent(): void {
    this.initializeVisitStatusOptions();
    this.initializeVisitCreatorOptions();
  }

  protected override getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[] {
    return [{ labelKey: 'VISIT_REQUEST_PAGE.ALL_VISITS' }];
  }

  protected override mapModelToExcelRow(model: Visit): { [key: string]: any } {
    return {
      [this.translateService.instant('VISIT_REQUEST_PAGE.NATIONAL_ID')]: model.nationalId,
      [this.translateService.instant('VISIT_REQUEST_PAGE.FULL_NAME')]: model.fullName,
      [this.translateService.instant('VISIT_REQUEST_PAGE.VISITOR_ORGANIZATION')]:
        model.visitorOrganization,
      [this.translateService.instant('VISIT_REQUEST_PAGE.VISIT_DATE')]: model.visitDate,
      [this.translateService.instant('VISIT_REQUEST_PAGE.VISIT_PURPOSE')]: model.visitPurpose,
      [this.translateService.instant('VISIT_REQUEST_PAGE.TARGET_DEPARTMENT')]:
        this.getDepartmentName(model),
      [this.translateService.instant('VISIT_REQUEST_PAGE.VISIT_STATUS')]: this.getStatusText(
        model.visitStatus
      ),
    };
  }

  openDialog(model?: Visit) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize2.width;
    dialogConfig.maxWidth = this.dialogSize2.maxWidth;
    const dialogRef = this.matDialog.open(AddEditVisitRequestPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result === DIALOG_ENUM.OK) {
        this.loadDataIfNeeded();
      }
    });
  }

  openViewDialog(model?: Visit) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize2.width;
    dialogConfig.maxWidth = this.dialogSize2.maxWidth;
    const dialogRef = this.matDialog.open(
      ViewActionVisitRequestPopupComponent as any,
      dialogConfig
    );

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result === DIALOG_ENUM.OK) {
        this.loadDataIfNeeded();
      }
    });
  }

  openQrcodeDialog(model?: Visit) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(QrcodeVisitRequestPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result === DIALOG_ENUM.OK) {
        this.loadDataIfNeeded();
      }
    });
  }

  openEditDialog(model: Visit) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize2.width;
    dialogConfig.maxWidth = this.dialogSize2.maxWidth;
    const dialogRef = this.matDialog.open(AddEditVisitRequestPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result === DIALOG_ENUM.OK) {
        this.loadDataIfNeeded();
      }
    });
  }
}
