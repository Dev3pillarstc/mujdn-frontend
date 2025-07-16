import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { PERMISSION_APPROVAL_LEVELS } from '@/enums/permission-approval-levels';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { City } from '@/models/features/lookups/city/city';
import { Department } from '@/models/features/lookups/department/department';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { LanguageService } from '@/services/shared/language.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { DepartmentPopupComponent } from '../department-popup/department-popup.component';

@Component({
  selector: 'app-department-header',
  imports: [TranslatePipe],
  templateUrl: './department-header.component.html',
  styleUrl: './department-header.component.scss',
})
export class DepartmentHeaderComponent {
  @Input() departmentData: Department | null = null;
  @Output() departmentDeleted = new EventEmitter<number>(); // Add this line
  @Input() cities: City[] = [];
  @Input() regions: BaseLookupModel[] = [];
  @Input() usersProfiles: BaseLookupModel[] = [];
  @Output() dialogClosed = new EventEmitter<void>();
  PERMISSION_APPROVAL_LEVELS = PERMISSION_APPROVAL_LEVELS;
  languageService = inject(LanguageService);
  departmentService = inject(DepartmentService);
  matDialog = inject(MatDialog);
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  getApprovalLevelText(): string {
    if (!this.departmentData) return '';

    const isOneLevel = this.departmentData.isOneLevelApproval;
    return isOneLevel ? 'ONE_LEVEL_APPROVAL' : 'TWO_LEVEL_APPROVAL';
  }

  delete(departmentId: number | undefined): void {
    this.departmentDeleted.emit(departmentId);
  }

  openDialog() {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    let lookups = {
      cities: this.cities,
      regions: this.regions,
      usersProfiles: this.usersProfiles,
    };

    dialogConfig.data = {
      model: this.departmentData ? new Department().clone(this.departmentData) : new Department(),
      lookups: lookups,
      viewMode: ViewModeEnum.EDIT,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;

    const dialogRef = this.matDialog.open(DepartmentPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.dialogClosed.emit();
      }
    });
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }
}
