import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { WorkMission } from '@/models/features/business/work-mission';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-mission-data-popup',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './view-mission-data-popup.component.html',
  styleUrl: './view-mission-data-popup.component.scss',
})
export class ViewMissionDataPopupComponent {
  dialogRef = inject(DialogRef);
  languageService = inject(LanguageService);
  model!: WorkMission;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { model: WorkMission }) {
    this.model = data.model;
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  close() {
    this.dialogRef.close();
  }
}
