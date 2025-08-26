import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Visit } from '@/models/features/visit/visit';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { VisitStatusEnum } from '@/enums/visit-status-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { AlertService } from '@/services/shared/alert.service';
import { VisitService } from '@/services/features/visit/visit.service';
import { formatDateOnly, formatTimeTo12Hour, toDateOnly } from '@/utils/general-helper';
import { FormGroup } from '@angular/forms';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable } from 'rxjs';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { DIALOG_ENUM } from '@/enums/dialog-enum';

@Component({
  selector: 'app-view-action-visit-request-popup',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './view-action-visit-request-popup.component.html',
  styleUrl: './view-action-visit-request-popup.component.scss',
})
export class ViewActionVisitRequestPopupComponent implements OnInit {
  declare model: Visit;
  declare viewMode: ViewModeEnum;
  alertService = inject(AlertService);
  visitService = inject(VisitService);
  translateService = inject(TranslateService);
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(MatDialogRef);

  // Enum references for template
  ViewModeEnum = ViewModeEnum;
  VisitStatusEnum = VisitStatusEnum;

  successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  ngOnInit(): void {
    this.initPopup();
  }

  initPopup() {
    this.model = this.data.model || new Visit();
    this.viewMode = this.data.viewMode || ViewModeEnum.VIEW;
  }

  // Helper methods for template
  isCurrentLanguageEnglish(): boolean {
    return this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH;
  }

  formatTime(timeString: string | Date | null | undefined): string {
    if (!timeString) return '';
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    return formatTimeTo12Hour(timeString.toString(), locale);
  }

  formatDate(dateString: string | Date | null | undefined): string {
    if (!dateString) return '';
    return formatDateOnly(dateString);
  }

  getDepartmentName(): string {
    if (!this.model.targetDepartment) return '';
    return this.isCurrentLanguageEnglish()
      ? this.model.targetDepartment.nameEn || ''
      : this.model.targetDepartment.nameAr || '';
  }

  getStatusText(): string {
    switch (this.model.visitStatus) {
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

  getStatusBadgeClass(): string {
    switch (this.model.visitStatus) {
      case VisitStatusEnum.NEW:
        return 'text-[14px] text-[#fff] min-h-[20px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#1570ef] font-medium';
      case VisitStatusEnum.APPROVED:
        return 'text-[14px] text-[#fff] min-h-[20px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#17b26a] font-medium';
      case VisitStatusEnum.REJECTED:
        return 'text-[14px] text-[#fff] min-h-[20px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#d92d20] font-medium';
      default:
        return 'text-[14px] text-[#fff] min-h-[20px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-gray-500 font-medium';
    }
  }

  // Action button methods - to be implemented later
  onApprove(): void {
    // Implementation to be added later
    console.log('Accept visit request:', this.model.id);
    // Call visit service to accept the request
    this.visitService.approveVisit(this.model.id).subscribe((response) => {
      this.alertService.showSuccessMessage(this.successObject);
      this.dialogRef.close(DIALOG_ENUM.OK);
    });
  }

  onReject(): void {
    // Implementation to be added later
    console.log('Reject visit request:', this.model.id);
    // Call visit service to reject the request
    this.visitService.rejectVisit(this.model.id).subscribe((response) => {
      this.alertService.showSuccessMessage(this.successObject);
      this.dialogRef.close(DIALOG_ENUM.OK);
    });
  }

  onBlockVisitor(): void {
    // Implementation to be added later
    console.log('Block visitor:', this.model.nationalId);

    // Call visit service to block the visitor
    this.visitService.blockVisitor(this.model.nationalId, this.model.id).subscribe((response) => {
      this.alertService.showSuccessMessage(this.successObject);
      this.dialogRef.close(DIALOG_ENUM.OK);
    });
  }

  close() {
    this.dialogRef.close();
  }

  // Check if actions should be shown
  shouldShowActions(): boolean {
    return this.viewMode === ViewModeEnum.TAKE_ACTION;
  }

  // Check if visitor can be blocked (business logic can be added here)
  canBlockVisitor(): boolean {
    return this.shouldShowActions();
  }

  // Check if request can be accepted/rejected
  canTakeAction(): boolean {
    return this.shouldShowActions() && this.model.visitStatus === VisitStatusEnum.NEW;
  }

  canViewCancel(): boolean {
    return !this.shouldShowActions();
  }
}
