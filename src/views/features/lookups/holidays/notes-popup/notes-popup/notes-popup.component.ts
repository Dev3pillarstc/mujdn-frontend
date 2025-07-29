import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-notes-popup',
  imports: [TranslatePipe],
  templateUrl: './notes-popup.component.html',
  styleUrl: './notes-popup.component.scss',
})
export class NotesPopupComponent implements OnInit {
  declare notes: string;
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  languageService = inject(LanguageService);
  declare direction: LAYOUT_DIRECTION_ENUM;

  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
    this.notes = this.data.notes;
  }

  close() {
    this.dialogRef.close();
  }
}
