import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TextareaModule } from 'primeng/textarea';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { RequiredMarkerDirective } from '../../../../directives/required-marker.directive';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { markFormGroupTouched } from '@/utils/general-helper';

@Component({
  selector: 'app-leaves-reject-popup',
  imports: [ReactiveFormsModule, TextareaModule, TranslatePipe, RequiredMarkerDirective, ValidationMessagesComponent],
  templateUrl: './leaves-reject-popup.component.html',
  styleUrl: './leaves-reject-popup.component.scss',
})
export class LeavesRejectPopupComponent {
  private dialogRef = inject(MatDialogRef<LeavesRejectPopupComponent>);
  private languageService = inject(LanguageService);
  fb = inject(FormBuilder);

  direction =
    this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? LAYOUT_DIRECTION_ENUM.LTR
      : LAYOUT_DIRECTION_ENUM.RTL;

  form = this.fb.group({
    rejectionNotes: [null as string | null, [Validators.required, Validators.maxLength(500)]],
  });

  get rejectionNotesControl() {
    return this.form.get('rejectionNotes') as FormControl;
  }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }
    this.dialogRef.close(this.form.value.rejectionNotes);
  }
}
