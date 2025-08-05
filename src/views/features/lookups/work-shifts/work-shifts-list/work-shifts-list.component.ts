import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { MatDialog } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { WorkShiftsListPopupComponent } from '../work-shifts-list-popup/work-shifts-list-popup.component';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import Shift from '@/models/features/lookups/work-shifts/shift';
import ShiftsFilter from '@/models/features/lookups/work-shifts/shifts-filter';
import { ShiftService } from '@/services/features/lookups/shift.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { formatTimeTo12Hour } from '@/utils/general-helper';

@Component({
  selector: 'app-work-shifts-list',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './work-shifts-list.component.html',
  styleUrl: './work-shifts-list.component.scss',
})
export default class WorkShiftsListComponent
  extends BaseListComponent<Shift, WorkShiftsListPopupComponent, ShiftService, ShiftsFilter>
  implements OnInit
{
  filterModel: ShiftsFilter = new ShiftsFilter();

  shiftService = inject(ShiftService);

  languageService = inject(LanguageService);
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  dialog = inject(MatDialog);
  date2: Date | undefined;
  attendance!: any[];

  override get service(): ShiftService {
    return this.shiftService;
  }

  override initListComponent(): void {}

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'WORK_SHIFTS.WORK_SHIFTS' }];
  }

  openDialog(model: Shift): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(WorkShiftsListPopupComponent as any, model, viewMode);
  }

  addOrEditModel(shift?: Shift) {
    shift = shift || new Shift();
    this.openDialog(shift);
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  // Format time to 12-hour format based on current language
  formatTime12Hour(timeString: string): string {
    if (!timeString) return '';
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    return formatTimeTo12Hour(timeString, locale);
  }

  // Get formatted time range based on current language
  getFormattedTimeRange(timeFrom: string, timeTo: string): string {
    const from = this.formatTime12Hour(timeFrom);
    const to = this.formatTime12Hour(timeTo);
    return `${from} - ${to}`;
  }
  protected override mapModelToExcelRow(model: Shift): { [key: string]: any } {
    const translate = this.translateService;

    return {
      [translate.instant('WORK_SHIFTS.SHIFT_NAME_AR')]: model.nameAr,
      [translate.instant('WORK_SHIFTS.SHIFT_NAME_EN')]: model.nameEn,
      [translate.instant('WORK_SHIFTS.MAX_ATTENDANCE_TIME')]: model.attendanceBuffer,
      [translate.instant('WORK_SHIFTS.MAX_LEAVE_TIME')]: model.leaveBuffer,
      [translate.instant('WORK_SHIFTS.TIME_FROM_TO')]: this.getFormattedTimeRange(
        model.timeFrom || '',
        model.timeTo || ''
      ),
      [translate.instant('WORK_SHIFTS.DEFAULT_SHIFT')]: this.excelShiftStatus(model),
    };
  }

  private excelShiftStatus(model: Shift): any {
    if (model.isActive) {
      return this.translateService.instant('WORK_SHIFTS.ACTIVE');
    } else {
      if (model.isActive === false) return this.translateService.instant('WORK_SHIFTS.NOT_ACTIVE');
      else return '---';
    }
  }
}
