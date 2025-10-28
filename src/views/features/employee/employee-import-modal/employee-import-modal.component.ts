import { Component, inject, OnInit } from '@angular/core';
import { ImportService } from '@/services/shared/import.service';
import { AlertService } from '@/services/shared/alert.service';
import { ImportExcelResponse } from '@/models/shared/import-excel-response';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { ExcelHelper } from '@/utils/excel-helper';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-employee-import-modal',
  imports: [TranslatePipe],
  templateUrl: './employee-import-modal.component.html',
  styleUrl: './employee-import-modal.component.scss',
})
export class EmployeeImportModalComponent implements OnInit {
  declare direction: LAYOUT_DIRECTION_ENUM;
  alertService = inject(AlertService);
  languageService = inject(LanguageService);
  selectedFile: File | null = null;
  importResponse: ImportExcelResponse = new ImportExcelResponse();
  dialogRef = inject(MatDialogRef);
  translateService = inject(TranslateService);
  maxFileSizeInMB: number = 2;
  importSheetRequiredHeaders = [
    'Email',
    'Password',
    'FullNameEn',
    'FullNameAr',
    'NationalId',
    'PhoneNumber',
    'FkRegionId',
    'FkCityId',
    'JobTitleEn',
    'JobTitleAr',
    'FkDepartmentId',
    'JoinDate',
    'CanLeaveWithoutFingerPrint',
    'IsActive',
  ];
  constructor(private importService: ImportService) {}
  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }
  downloadTemplate() {
    const link = document.createElement('a');
    link.href = 'assets/import-templates/import-employees-template.xlsx';
    link.download = 'employees-template.xlsx';
    link.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    ExcelHelper.validateImportSheetHeaders(this.importSheetRequiredHeaders, file)
      .pipe(
        tap((result) => {
          if (!result.validHeaders) {
            input.value = '';
            const missingFields = result.missing.join(', ');
            const errorMessage = this.translateService
              .instant('COMMON.EXCEL_MISSING_FIELDS')
              .concat(` (${missingFields})`);
            this.alertService.showErrorMessage({ messages: [errorMessage] });
            throw new Error('Invalid headers'); // stop the stream
          }

          if (!this.isValidFileSize(file)) {
            input.value = '';
            this.showInvalidFileSizeError();
            throw new Error('Invalid file size'); // stop the stream
          }
        }),
        switchMap(() => ExcelHelper.validateHasDataRows(file)),
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
        next: () => {
          // ✅ All validations passed
          this.selectedFile = file;
        },
        error: (err) => {
          // Errors are already handled via alerts — optional log
          console.warn('Validation stopped:', err.message || err);
        },
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

    this.importService.importEmployees(formData).subscribe({
      next: (response) => {
        if (response.data.hasErrors) {
          this.importResponse = response.data;
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
    return this.translateService.instant('IMPORT.THE_MAXIMUM_ALLOWED_FILE_SIZE').replace('{size}', this.maxFileSizeInMB);
  }

  onCancel(): void {
    this.selectedFile = null;
    this.dialogRef.close(DIALOG_ENUM.CANCEL);
  }
}
