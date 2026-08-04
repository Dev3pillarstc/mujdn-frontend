import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { PERMISSION_STATUS_ENUM } from '@/enums/permission-status-enum';
import { Permission } from '@/models/features/lookups/permission/permission';
import { AuthService } from '@/services/auth/auth.service';
import { PermissionService } from '@/services/features/lookups/permission.service';
import { AlertService } from '@/services/shared/alert.service';
import { LanguageService } from '@/services/shared/language.service';
import { downloadBlobData } from '@/utils/utils';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PermissionDetailsCardComponent } from '../../components/permission-details-card/permission-details-card.component';

@Component({
  selector: 'app-permissions-data-popup',
  imports: [TranslatePipe, PermissionDetailsCardComponent],
  templateUrl: './permissions-data-popup.component.html',
  styleUrl: './permissions-data-popup.component.scss',
})
export class PermissionsDataPopupComponent implements OnInit {
  declare model: Permission;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(PermissionService);
  fb = inject(FormBuilder);
  languageService = inject(LanguageService);
  translateService = inject(TranslateService);
  authService = inject(AuthService);
  dialogRef = inject(MatDialogRef);
  statusEnum = PERMISSION_STATUS_ENUM;
  permissionStatusEnum = PERMISSION_STATUS_ENUM;
  declare direction: LAYOUT_DIRECTION_ENUM;
  showDownloadPdf: boolean = false;
  isDownloadingPdf = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.model = this.data.model;
    // Downloading the permission as a file is limited to department managers reviewing
    // accepted incoming requests, it is never offered on the user own permissions.
    this.showDownloadPdf =
      !!this.data.isIncomingPermission &&
      !!this.authService.isDepartmentManager &&
      this.model.isAccepted();
    this.setLayoutDirection();
  }

  private setLayoutDirection() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }

  downloadAsPDF(): void {
    if (this.isDownloadingPdf) return;

    this.isDownloadingPdf = true;
    this.service
      .exportPermissionPdf(this.languageService.getCurrentLanguage(), { id: this.model.id })
      .pipe(finalize(() => (this.isDownloadingPdf = false)))
      .subscribe({
        next: (blob) => {
          if (!blob || blob.size === 0) {
            this.alertService.showErrorMessage({ messages: ['COMMON.NO_DATA_TO_EXPORT'] });
            return;
          }

          downloadBlobData(blob, this.getPermissionPdfFileName());
        },
        error: () => {
          this.alertService.showErrorMessage({ messages: ['COMMON.ERROR'] });
        },
      });
  }

  private getPermissionPdfFileName(): string {
    const title = this.translateService.instant('PERMISSION_PAGE.PERMISSION_PDF_FILE_NAME');
    const employeeName = this.model.getCreationUserName();
    return `${employeeName ? `${title} - ${employeeName}` : title}.pdf`;
  }

  acceptPermission() {
    this.service.acceptPermission(this.model.id).subscribe({
      next: (updatedPermission) => {
        this.model = updatedPermission; // optionally update local model
        this.dialogRef.close(DIALOG_ENUM.OK);
      },
    });
  }

  rejectPermission() {
    this.service.rejectPermission(this.model.id).subscribe({
      next: (updatedPermission) => {
        this.model = updatedPermission; // optionally update local model
        this.dialogRef.close(DIALOG_ENUM.OK);
      },
      error: (err) => {
        this.dialogRef.close(DIALOG_ENUM.OK);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
