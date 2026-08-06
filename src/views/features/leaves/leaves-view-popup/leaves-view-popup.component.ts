import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Leave } from '@/models/features/lookups/leave/leave';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LEAVE_STATUS_ENUM } from '@/enums/leave-status-enum';

@Component({
  selector: 'app-leaves-view-popup',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './leaves-view-popup.component.html',
  styleUrl: './leaves-view-popup.component.scss',
})
export class LeavesViewPopupComponent {
  private dialogRef = inject(MatDialogRef<LeavesViewPopupComponent>);
  private languageService = inject(LanguageService);

  model: Leave;
  direction: LAYOUT_DIRECTION_ENUM;
  leaveStatusEnum = LEAVE_STATUS_ENUM;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.model = data?.model;
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  close() {
    this.dialogRef.close();
  }

  get statusBadgeClass(): string {
    switch (this.model?.status) {
      case LEAVE_STATUS_ENUM.New:
        return 'inline-flex items-center gap-2 px-4 py-0.5 rounded-full bg-[#1570ef] text-white text-base font-medium';
      case LEAVE_STATUS_ENUM.Accepted:
        return 'inline-flex items-center gap-2 px-4 py-0.5 rounded-full bg-[#067647] text-white text-base font-medium';
      case LEAVE_STATUS_ENUM.Rejected:
        return 'inline-flex items-center gap-2 px-4 py-0.5 rounded-full bg-[#d92d20] text-white text-base font-medium';
      default:
        return 'inline-flex items-center gap-2 px-4 py-0.5 rounded-full bg-gray-500 text-white text-base font-medium';
    }
  }

  get statusTextKey(): string {
    switch (this.model?.status) {
      case LEAVE_STATUS_ENUM.New:
        return 'LEAVES_PAGE.NEW';
      case LEAVE_STATUS_ENUM.Accepted:
        return 'LEAVES_PAGE.ACCEPTED';
      case LEAVE_STATUS_ENUM.Rejected:
        return 'LEAVES_PAGE.REJECTED';
      default:
        return '';
    }
  }

  employeeName(): string {
    const lang = this.languageService.getCurrentLanguage();
    return (
      (lang === LANGUAGE_ENUM.ARABIC
        ? this.model?.employee?.nameAr
        : (this.model?.employee?.nameEn ?? this.model?.employee?.nameAr)) ?? ''
    );
  }

  departmentName(): string {
    const lang = this.languageService.getCurrentLanguage();
    return (
      (lang === LANGUAGE_ENUM.ARABIC
        ? this.model?.employee?.department?.nameAr
        : (this.model?.employee?.department?.nameEn ??
          this.model?.employee?.department?.nameAr)) ?? ''
    );
  }

  leaveTypeName(): string {
    const lang = this.languageService.getCurrentLanguage();
    return (
      (lang === LANGUAGE_ENUM.ARABIC
        ? this.model?.leaveType?.nameAr
        : (this.model?.leaveType?.nameEn ?? this.model?.leaveType?.nameAr)) ?? ''
    );
  }
}
