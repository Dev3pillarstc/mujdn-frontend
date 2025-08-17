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

@Component({
  selector: 'app-all-visit-request-list',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
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

  override filterModel: VisitFilter = new VisitFilter();
  visitService = inject(VisitService);

  private hasInitialized = false;

  override get service(): VisitService {
    return this.visitService;
  }

  date2: Date | undefined;
  nationalities!: any[];
  items: MenuItem[] | undefined;

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

  private loadDataIfNeeded(): void {
    // Load data when tab becomes active using the generic loadList function
    this.loadList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: (error) => this.handleLoadListError(),
      });
  }

  override initListComponent(): void {
    // Initial component setup if needed
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
    };
  }

  openDialog(model?: any) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize2.width;
    dialogConfig.maxWidth = this.dialogSize2.maxWidth;
    const dialogRef = this.matDialog.open(AddEditVisitRequestPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      console.log('closed');
    });
  }

  openViewDialog(model?: any) {
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
      console.log('closed');
    });
  }

  openQrcodeDialog(model?: any) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(QrcodeVisitRequestPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      console.log('closed');
    });
  }
}
