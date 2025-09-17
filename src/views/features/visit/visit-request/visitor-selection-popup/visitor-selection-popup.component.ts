import { Component, inject, OnInit } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
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
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';

@Component({
  selector: 'app-visitor-selection-popup',
  imports: [
    InputText,
    TranslatePipe,
    ReactiveFormsModule,
    CommonModule,
    ValidationMessagesComponent,
    RequiredMarkerDirective,
  ],
  templateUrl: './visitor-selection-popup.component.html',
  styleUrl: './visitor-selection-popup.component.scss',
})
export class VisitorSelectionPopupComponent implements OnInit {
  // Injected services
  private visitService = inject(VisitService);
  private languageService = inject(LanguageService);
  private dialogRef = inject(MatDialogRef<VisitorSelectionPopupComponent>);
  private fb = inject(FormBuilder);
  declare direction: LAYOUT_DIRECTION_ENUM;
  declare form: FormGroup;

  // Form data
  selectedOption: 'existing' | 'new' = 'existing';
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

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      nationalId: ['', [Validators.required, CustomValidators.pattern('NATIONAL_ID')]],
    });
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
      this.dialogRef.close({
        action: DIALOG_ENUM.OK,
        visitor: new Visit(),
        viewMode: ViewModeEnum.CREATE,
      });
    } else if (this.selectedOption === 'existing') {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      this.loadVisitorData();
    }
  }

  private loadVisitorData() {
    this.errorMessage = '';
    const nationalId = this.form.get('nationalId')?.value?.trim();

    this.visitService.loadVisitorByNationalId(nationalId).subscribe({
      next: (visitor: Visit) => {
        if (visitor) {
          visitor.nationalIdExpiryDate = toDateTime(visitor.nationalIdExpiryDate);
          // Return visitor to parent
          this.dialogRef.close({
            action: DIALOG_ENUM.OK,
            visitor,
            viewMode: ViewModeEnum.CREATE_FROM_EXISTING,
          });
        }
      },
    });
  }

  get rotateArrow() {
    return this.direction === LAYOUT_DIRECTION_ENUM.LTR ? 'rotate-180' : '';
  }

  get nationalIdControl() {
    return this.form.get('nationalId') as FormControl;
  }
}
