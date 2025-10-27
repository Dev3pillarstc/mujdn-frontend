import { Component, inject, OnInit } from '@angular/core';
import { ImportService } from '@/services/shared/import.service';
import { AlertService } from '@/services/shared/alert.service';
import { ImportExcelError } from '@/models/shared/import-excel-error';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { ExcelHelper } from '@/utils/excel-helper';

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
  importError: ImportExcelError = new ImportExcelError();
  dialogRef = inject(MatDialogRef);
  translateService = inject(TranslateService);
  maxFileSizeInMB: number = 20;
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
    if (input.files && input.files.length > 0) {
      ExcelHelper.validateImportEmployeesHeaders(input.files[0]).subscribe((result) => {
        // if (result.validHeaders) {
        //   if (this.isValidFileSize(input.files![0])) {
        //     this.selectedFile = input.files![0];
        //   } else {
        //     input.value = '';
        //     this.showInvalidFileSizeError();
        //   }
        // } else {
        //   input.value = '';
        //   let errorMessage = this.translateService
        //     .instant('COMMON.EXCEL_MISSING_FIELDS')
        //     .concat(' ('.concat(result.missing.join(', ').concat(')')));
        //   this.alertService.showErrorMessage({ messages: [errorMessage] });
        // }

        const file = input.files?.[0];
        if (!file) return;

        if(!result.validHeaders) {
          input.value = '';

          const missingFields = result.missing.join(', ');
          const errorMessage = this.translateService
            .instant('COMMON.EXCEL_MISSING_FIELDS')
            .concat(` (${missingFields})`);

          this.alertService.showErrorMessage({ messages: [errorMessage] });
          return;
        }

        if (!this.isValidFileSize(file)) {
          input.value = '';
          this.showInvalidFileSizeError();
          return;
        }

        this.selectedFile = file;
      });
    }
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
          this.importError = response.data;
        } else if (!response.data.hasErrors) {
          this.dialogRef.close(DIALOG_ENUM.OK);
        }
      },
    });
  }

  downloadReviewFile(): void {
    ExcelHelper.downloadExcelFromBase64(this.importError.errorLogFile!);
  }

  onCancel(): void {
    this.selectedFile = null;
  }
}
