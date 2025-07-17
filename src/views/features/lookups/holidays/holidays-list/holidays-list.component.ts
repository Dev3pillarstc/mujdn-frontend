import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { HolidaysPopupComponent } from '../holidays-popup/holidays-popup.component';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { Holiday } from '@/models/features/lookups/holiday/holiday';
import { HolidayService } from '@/services/features/lookups/holiday.service';
import { LanguageService } from '@/services/shared/language.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HolidayFilter } from '@/models/features/lookups/holiday/holiday-filter';
import { AuthService } from '@/services/auth/auth.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { NotesPopupComponent } from '../notes-popup/notes-popup/notes-popup.component';

@Component({
  selector: 'app-holidays-list',
  imports: [
    Breadcrumb,
    TableModule,
    PaginatorModule,
    InputTextModule,
    FormsModule,
    TranslatePipe,
    DatePickerModule,
    FluidModule,
    TableModule,
    CommonModule,
    RouterModule,
  ],

  templateUrl: './holidays-list.component.html',
  styleUrl: './holidays-list.component.scss',
})
export default class HolidaysListComponent extends BaseListComponent<
  Holiday,
  HolidaysPopupComponent,
  HolidayService,
  HolidayFilter
> {
  languageService = inject(LanguageService); // Assuming you have a LanguageService to handle language changes
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  holidayService = inject(HolidayService);
  translateService = inject(TranslateService);
  authService = inject(AuthService);
  override breadcrumbs: MenuItem[] | undefined;
  filterModel: HolidayFilter = new HolidayFilter();
  override get service() {
    return this.holidayService;
  }

  override initListComponent(): void {
    this.breadcrumbs = [{ label: 'HOLIDAYS_PAGE.HOLIDAYS_LIST' }];
  }

  override openDialog(model: Holiday): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(HolidaysPopupComponent as any, model, viewMode);
  }

  addOrEditModel(holiday?: Holiday): void {
    this.openDialog(holiday ?? new Holiday());
  }

  protected override mapModelToExcelRow(model: Holiday): { [key: string]: any } {
    return {
      [this.translateService.instant('HOLIDAYS_PAGE.HOLIDAY')]: model.getName(),
      [this.translateService.instant('HOLIDAYS_PAGE.START_DATE')]: model.getStartDate(),
      [this.translateService.instant('HOLIDAYS_PAGE.END_DATE')]: model.getEndDate(),
    };
  }
  showAddEditButtons() {
    return this.authService.isHROfficer;
  }
  openDataDialog(notes: string): void {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { notes: notes };
    this.matDialog.open(NotesPopupComponent as any, dialogConfig);
  }
}
