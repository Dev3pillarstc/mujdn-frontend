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
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { Holiday } from '@/models/features/lookups/holiday/holiday';
import { HolidayService } from '@/services/features/lookups/holiday.service';
import { LanguageService } from '@/services/shared/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { HolidayFilter } from '@/models/features/lookups/holiday/holiday-filter';

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
  home: MenuItem | undefined;
  filterModel: HolidayFilter = new HolidayFilter();

  override get service() {
    return this.holidayService;
  }

  override initListComponent(): void {}

  override openDialog(model: Holiday): void {
    const viewMode = model ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(HolidaysPopupComponent as any, model, viewMode);
  }

  addOrEditModel(holiday?: Holiday) {
    holiday = holiday || new Holiday();
    this.openDialog(holiday);
  }

  protected override mapModelToExcelRow(model: Holiday): { [key: string]: any } {
    const lang = this.languageService.getCurrentLanguage(); // 'ar' or 'en'
    return {
      [lang === LANGUAGE_ENUM.ARABIC ? 'العطلة' : 'Holiday']:
        lang === LANGUAGE_ENUM.ARABIC ? model.nameAr : model.nameEn,
      [lang === LANGUAGE_ENUM.ARABIC ? 'تاريخ البداية' : 'Start Date']: model.startDate
        ? new Date(model.startDate).toLocaleDateString(
            lang === LANGUAGE_ENUM.ARABIC ? 'ar-EG' : 'en-US'
          )
        : '',
      [lang === LANGUAGE_ENUM.ARABIC ? 'تاريخ النهاية' : 'End Date']: model.endDate
        ? new Date(model.endDate).toLocaleDateString(
            lang === LANGUAGE_ENUM.ARABIC ? 'ar-EG' : 'en-US'
          )
        : '',
      [lang === LANGUAGE_ENUM.ARABIC ? 'ملاحظات' : 'Notes']: model.notes || '',
    };
  }

  override search(): void {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.service.getFilteredHolidays(this.filterModel, this.paginationParams).subscribe({
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
}
