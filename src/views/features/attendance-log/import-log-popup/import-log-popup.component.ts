import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { AlertService } from '@/services/shared/alert.service';
import { LanguageService } from '@/services/shared/language.service';
import { ImportExcelResponse } from '@/models/shared/import-excel-response';
import { MatDialogRef } from '@angular/material/dialog';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ExcelHelper } from '@/utils/excel-helper';
import { switchMap, tap } from 'rxjs';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { SpreadsheetXmlHelper } from '@/utils/spreadsheet-xml-helper';
import { ImportService } from '@/services/shared/import.service';

@Component({
  selector: 'app-import-log-popup',
  imports: [TranslatePipe],
  templateUrl: './import-log-popup.component.html',
  styleUrl: './import-log-popup.component.scss',
})
export class ImportLogPopupComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  declare direction: LAYOUT_DIRECTION_ENUM;
  alertService = inject(AlertService);
  languageService = inject(LanguageService);
  selectedFile?: File;
  importResponse: ImportExcelResponse = new ImportExcelResponse();
  dialogRef = inject(MatDialogRef);
  translateService = inject(TranslateService);
  maxFileSizeInMB: number = 5;
  requiredHeaders = ['ID', 'Recorded Time', 'Status'];
  requiredValues = ['Recorded Time', 'Status'];

  constructor(private importService: ImportService) {}

  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  onFileSelected(event: Event): void {
    this.importResponse = new ImportExcelResponse();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const isXmlExt = /\.xml$/i.test(file.name);
    if (!isXmlExt) {
      input.value = '';
      const msg = this.translateService.instant('COMMON.INVALID_XML_FILE_TYPE');
      this.alertService.showErrorMessage({ messages: [msg] });
      return; // stop here
    }

    SpreadsheetXmlHelper.validateSpreadsheetXmlHeaders(
      file,
      this.requiredHeaders  // headers that must exist
    )
      .pipe(
        tap((result) => {
          if (!result.validHeaders) {
            input.value = '';
            const missingFields = result.missing.join(', ');
            const msg = this.translateService.instant('COMMON.EXCEL_MISSING_FIELDS')
              + ` (${missingFields})`;
            this.alertService.showErrorMessage({ messages: [msg] });
            throw new Error('Invalid headers');
          }

          if (!this.isValidFileSize(file)) {
            input.value = '';
            this.showInvalidFileSizeError();
            throw new Error('Invalid file size');
          }
        }),
        switchMap(() =>
          SpreadsheetXmlHelper.validateSpreadsheetXmlDataValues(
            file,
            this.requiredValues // only these must have values
          )
        ),
        tap((hasData) => {
          if (!hasData) {
            input.value = '';
            const msg = this.translateService.instant('COMMON.EXCEL_NO_DATA_ROWS');
            this.alertService.showErrorMessage({ messages: [msg] });
            throw new Error('No data rows');
          }
        })
      )
      .subscribe({
        next: () => (this.selectedFile = file),
        error: (err) => console.warn('Validation stopped:', err.message || err),
      });
  }

  showInvalidFileSizeError() {
    let invalidFileSizeMessage = this.translateService
      .instant('COMMON.FILE_SIZE_CAN_NOT_EXCEED')
      .replace('{size}', this.maxFileSizeInMB);
    this.alertService.showErrorMessage({ messages: [invalidFileSizeMessage] });
  }

  isValidFileSize(file: File) {
    const maxSizeMB = this.maxFileSizeInMB;
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
  }

  onImport(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.importService.importAttendanceLogsXml(formData).subscribe({
      next: (response) => {
        if (response.data.hasErrors) {
          this.importResponse = response.data;
          this.clearFileSelection();
        } else if (!response.data.hasErrors) {
          this.dialogRef.close(DIALOG_ENUM.OK);
        }
      },
    });
  }

  downloadReviewFile(): void {
    ExcelHelper.downloadExcelFromBase64(this.importResponse.errorLogFile!);
  }

  getMaxAllowedFileSizeMessage() {
    return this.translateService
      .instant('IMPORT.THE_MAXIMUM_ALLOWED_FILE_SIZE')
      .replace('{size}', this.maxFileSizeInMB);
  }

  clearFileSelection(): void {
    this.selectedFile = undefined;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onCancel(): void {
    this.selectedFile = undefined;
    this.dialogRef.close(DIALOG_ENUM.CANCEL);
  }
}
