import { PERMISSION_STATUS_ENUM } from '@/enums/permission-status-enum';
import { Permission } from '@/models/features/lookups/permission/permission';
import { AlertService } from '@/services/shared/alert.service';
import { exportElementToPdf } from '@/utils/pdf-helper';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-permission-details-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './permission-details-card.component.html',
})
export class PermissionDetailsCardComponent {
  @Input({ required: true }) model!: Permission;

  @ViewChild('cardContent', { static: true }) cardContent!: ElementRef<HTMLElement>;

  permissionStatusEnum = PERMISSION_STATUS_ENUM;
  alertService = inject(AlertService);
  translateService = inject(TranslateService);

  async downloadAsPDF(): Promise<void> {
    try {
      await exportElementToPdf(this.cardContent.nativeElement, this.getPdfFileName());
    } catch (_) {
      this.alertService.showErrorMessage({ messages: ['COMMON.ERROR'] });
    }
  }

  private getPdfFileName(): string {
    const title = this.translateService.instant('PERMISSION_PAGE.PERMISSION_PDF_FILE_NAME');
    const employeeName = this.model?.getCreationUserName();
    return `${employeeName ? `${title} - ${employeeName}` : title}.pdf`;
  }
}
