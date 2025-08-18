import { Component, inject, OnInit } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { VisitService } from '@/services/features/visit/visit.service';
import { Visit } from '@/models/features/visit/visit';
import { AddEditVisitRequestPopupComponent } from '../add-edit-visit-request-popup/add-edit-visit-request-popup.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { CommonModule } from '@angular/common';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { toDateTime } from '@/utils/general-helper';

@Component({
  selector: 'app-visitor-selection-popup',
  imports: [InputText, TranslatePipe, FormsModule, CommonModule],
  templateUrl: './visitor-selection-popup.component.html',
  styleUrl: './visitor-selection-popup.component.scss',
})
export class VisitorSelectionPopupComponent {
  // Injected services
  private visitService = inject(VisitService);
  private languageService = inject(LanguageService);
  private dialogRef = inject(MatDialogRef<VisitorSelectionPopupComponent>);
  declare direction: LAYOUT_DIRECTION_ENUM;

  // Form data
  selectedOption: 'existing' | 'new' = 'existing';
  nationalId: string = '';
  errorMessage: string = '';

  // Data passed from parent
  departments: BaseLookupModel[] = [];
  nationalities: BaseLookupModel[] = [];

  constructor() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  onOptionChange(option: 'existing' | 'new') {
    this.selectedOption = option;
    this.errorMessage = '';
  }

  onCancel() {
    this.dialogRef.close(DIALOG_ENUM.CANCEL);
  }

  onNext() {
    if (this.selectedOption === 'new') {
      // Return empty Visit to parent
      this.dialogRef.close({ action: DIALOG_ENUM.OK, visitor: new Visit() });
    } else if (this.selectedOption === 'existing') {
      if (!this.nationalId || this.nationalId.trim() === '') {
        this.errorMessage = 'VISIT_REQUEST_PAGE.NATIONAL_ID_REQUIRED';
        return;
      }

      this.loadVisitorData();
    }
  }

  private loadVisitorData() {
    this.errorMessage = '';

    this.visitService.loadVisitorByNationalId(this.nationalId.trim()).subscribe({
      next: (visitor: Visit) => {
        if (visitor) {
          visitor.nationalIdExpiryDate = toDateTime(visitor.nationalIdExpiryDate);
          // Return visitor to parent
          this.dialogRef.close({ action: DIALOG_ENUM.OK, visitor });
        } else {
          this.errorMessage = 'VISIT_REQUEST_PAGE.VISITOR_NOT_FOUND';
        }
      },
      error: (error) => {
        console.error('Error loading visitor data:', error);
        this.errorMessage = 'VISIT_REQUEST_PAGE.ERROR_LOADING_VISITOR';
      },
    });
  }

  get rotateArrow() {
    return this.direction === LAYOUT_DIRECTION_ENUM.LTR ? 'rotate-180' : '';
  }
}
