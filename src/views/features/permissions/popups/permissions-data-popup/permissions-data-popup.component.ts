import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
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
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-permissions-data-popup',
  imports: [CommonModule, TranslatePipe],
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
  dialogRef = inject(MatDialogRef);
  statusEnum = PERMISSION_STATUS_ENUM;
  permissionStatusEnum = PERMISSION_STATUS_ENUM;
  declare direction: LAYOUT_DIRECTION_ENUM;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.model = this.data.model;
    this.setLayoutDirection();
  }

  private setLayoutDirection() {
    this.direction = this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? LAYOUT_DIRECTION_ENUM.LTR
      : LAYOUT_DIRECTION_ENUM.RTL;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'], icon: 'success' };
    this.alertService.showSuccessMessage(successObject);
  }

  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }

  acceptPermissionStatus() {
    this.service.acceptPermission(this.model.id).subscribe({
      next: (updatedPermission) => {
        this.model = updatedPermission; // optionally update local model
        this.afterSave();
        this.dialogRef.close(DIALOG_ENUM.OK);
      },
      error: (err) => { },
    });
  }

  rejectPermissionStatus() {
    this.service.rejectPermission(this.model.id).subscribe({
      next: (updatedPermission) => {
        this.model = updatedPermission; // optionally update local model
        this.dialogRef.close(DIALOG_ENUM.OK);
      },
      error: (err) => { },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
