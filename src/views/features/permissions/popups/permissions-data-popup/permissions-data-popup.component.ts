import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { PERMISSION_STATUS_ENUM } from '@/enums/permission-status-enum';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Permission } from '@/models/features/lookups/permission/permission';
import { PermissionService } from '@/services/features/lookups/permission.service';
import { AlertService } from '@/services/shared/alert.service';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-permissions-data-popup',
  imports: [CommonModule],
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
  isArabic = this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ARABIC;
  dialogRef = inject(MatDialogRef);
  canTakeAction = this.data.ViewMode == ViewModeEnum.TAKE_ACTION;
  statusEnum = PERMISSION_STATUS_ENUM;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.model = this.data.model;
    console.log(this.model);
  }

  beforeSave(model: Permission, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }
  acceptPermissionStatus() {
    this.service.updateStatus(this.model.id, PERMISSION_STATUS_ENUM.Accepted).subscribe({
      next: (updatedPermission) => {
        this.model = updatedPermission; // optionally update local model
        this.dialogRef.close(DIALOG_ENUM.OK);
      },
      error: (err) => {},
    });
  }
  rejectPermissionStatus() {
    this.service.updateStatus(this.model.id, PERMISSION_STATUS_ENUM.Rejected).subscribe({
      next: (updatedPermission) => {
        this.model = updatedPermission; // optionally update local model
        this.dialogRef.close(DIALOG_ENUM.OK);
      },
      error: (err) => {},
    });
  }
  close() {
    this.dialogRef.close();
  }
}
