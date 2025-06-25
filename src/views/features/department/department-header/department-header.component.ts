import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { PERMISSION_APPROVAL_LEVELS } from '@/enums/permission-approval-levels';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { UserProfilesLookop } from '@/models/auth/users-profiles-lookup';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { City } from '@/models/features/lookups/City/city';
import { Department } from '@/models/features/lookups/Department/department';
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
  @Input() usersProfiles: UserProfilesLookop[] = [];
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
    if (!departmentId) return;

    this.departmentService.delete(departmentId).subscribe({
      next: () => {
        this.departmentDeleted.emit(departmentId);
      },
      error: (err) => {
        console.error(`Failed to delete department with ID ${departmentId}:`, err);
      },
    });
  }

  openDialog() {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    let lookups = {
      cities: this.cities,
      regions: this.regions,
      usersProfiles: this.usersProfiles,
    };

    console.log('Opening dialog with data:', {
      model: this.departmentData,
      lookups: lookups,
      viewMode: ViewModeEnum.EDIT,
    });

    dialogConfig.data = { model: this.departmentData, lookups: lookups, viewMode: ViewModeEnum.EDIT };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;

    const dialogRef = this.matDialog.open(DepartmentPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.dialogClosed.emit();
      }
    });
  }
  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }
}
