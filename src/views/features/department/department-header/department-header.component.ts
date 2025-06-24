import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { PERMISSION_APPROVAL_LEVELS } from '@/enums/permission-approval-levels';
import { Department } from '@/models/features/lookups/Department/department';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { LanguageService } from '@/services/shared/language.service';
import { Component, inject, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-department-header',
  imports: [TranslatePipe],
  templateUrl: './department-header.component.html',
  styleUrl: './department-header.component.scss',
})
export class DepartmentHeaderComponent {
  @Input() departmentData: Department | null = null;
  PERMISSION_APPROVAL_LEVELS = PERMISSION_APPROVAL_LEVELS;
  languageService = inject(LanguageService);
  departmentService = inject(DepartmentService);
  getApprovalLevelText(): string {
    if (!this.departmentData) return '';

    const isOneLevel = this.departmentData.isOneLevelApproval;
    return isOneLevel ? 'ONE_LEVEL_APPROVAL' : 'TWO_LEVEL_APPROVAL';
  }
  delete(departmentId: number | undefined): void {
    if (!departmentId) return;

    this.departmentService.delete(departmentId).subscribe({
      next: () => {
        console.log(`Department with ID ${departmentId} deleted successfully.`);
        // Optionally, emit an event or refresh the parent component's data
      },
      error: (err) => {
        console.error(`Failed to delete department with ID ${departmentId}:`, err);
      },
    });
  }
  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }
}
