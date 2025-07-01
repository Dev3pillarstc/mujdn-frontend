import { Component, inject } from '@angular/core';
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
import { TranslatePipe } from '@ngx-translate/core';

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
    TranslatePipe
  ],
  templateUrl: './work-shifts-list.component.html',
  styleUrl: './work-shifts-list.component.scss',
})
export default class WorkShiftsListComponent extends BaseListComponent<Shift, WorkShiftsListPopupComponent, ShiftService, ShiftsFilter> {

  filterModel: ShiftsFilter = new ShiftsFilter();

  shiftService = inject(ShiftService);

  languageService = inject(LanguageService);

  override get service(): ShiftService {
    return this.shiftService;
  }
  override initListComponent(): void {

  }

  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  dialog = inject(MatDialog);
  home: MenuItem | undefined;
  date2: Date | undefined;
  attendance!: any[];

  openDialog(model: Shift): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(WorkShiftsListPopupComponent as any, model, viewMode);
  }

  addOrEditModel(shift?: Shift) {
    shift = shift || new Shift();
    this.openDialog(shift);
  }

  protected override mapModelToExcelRow(model: Shift): { [key: string]: any } {
    const lang = this.languageService.getCurrentLanguage();
    return {
      [lang === LANGUAGE_ENUM.ARABIC ? 'ورديات العمل' : 'Work shift']:
        lang === LANGUAGE_ENUM.ARABIC ? model.nameAr : model.nameEn,
    };
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }
}
