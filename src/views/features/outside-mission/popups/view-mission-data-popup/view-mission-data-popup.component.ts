import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { WorkMission } from '@/models/features/business/work-mission';
import { getWorkMissionTypeName } from '@/models/features/business/work-mission-type-option';
import { AuthService } from '@/services/auth/auth.service';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { AlertService } from '@/services/shared/alert.service';
import { LanguageService } from '@/services/shared/language.service';
import { downloadBlobData } from '@/utils/utils';
import { DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-view-mission-data-popup',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './view-mission-data-popup.component.html',
  styleUrl: './view-mission-data-popup.component.scss',
})
export class ViewMissionDataPopupComponent {
  dialogRef = inject(DialogRef);
  languageService = inject(LanguageService);
  translateService = inject(TranslateService);
  alertService = inject(AlertService);
  authService = inject(AuthService);
  service = inject(WorkMissionService);
  model!: WorkMission;
  declare direction: LAYOUT_DIRECTION_ENUM;
  showDownloadPdf: boolean = false;
  isDownloadingPdf = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { model: WorkMission }) {
    this.model = data.model;
    // Downloading the mission as a file is offered to the same audience that manages
    // missions (department managers and HR officers), like permission downloads.
    this.showDownloadPdf = !!(this.authService.isDepartmentManager || this.authService.isHROfficer);
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }
  getWorkMissionTypeName(model: WorkMission): string {
    return getWorkMissionTypeName(model.workMissionType, this.isCurrentLanguageEnglish());
  }

  downloadAsPDF(): void {
    if (this.isDownloadingPdf) return;

    this.isDownloadingPdf = true;
    this.service
      .exportMissionPdf(this.languageService.getCurrentLanguage(), { id: this.model.id })
      .pipe(finalize(() => (this.isDownloadingPdf = false)))
      .subscribe({
        next: (blob) => {
          if (!blob || blob.size === 0) {
            this.alertService.showErrorMessage({ messages: ['COMMON.NO_DATA_TO_EXPORT'] });
            return;
          }

          downloadBlobData(blob, this.getMissionPdfFileName());
        },
        error: () => {
          this.alertService.showErrorMessage({ messages: ['COMMON.ERROR'] });
        },
      });
  }

  private getMissionPdfFileName(): string {
    const title = this.translateService.instant('WORK_MISSIONS.MISSION_PDF_FILE_NAME');
    const missionName = this.isCurrentLanguageEnglish() ? this.model.nameEn : this.model.nameAr;
    return `${missionName ? `${title} - ${missionName}` : title}.pdf`;
  }

  close() {
    this.dialogRef.close();
  }
}
