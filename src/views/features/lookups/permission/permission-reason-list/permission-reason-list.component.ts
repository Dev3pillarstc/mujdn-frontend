import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { PermissionReason } from '@/models/features/lookups/permission/permission-reason';
import { PermissionReasonFilter } from '@/models/features/lookups/permission/permission-reason-filter';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PermissionReasonPopupComponent } from '@/views/features/lookups/permission/permission-reason-popup/permission-reason-popup.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';

@Component({
  selector: 'app-permission-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
  templateUrl: './permission-reason-list.component.html',
  styleUrl: './permission-reason-list.component.scss',
})
export default class PermissionReasonListComponent
  extends BaseListComponent<
    PermissionReason,
    PermissionReasonPopupComponent,
    PermissionReasonService,
    PermissionReasonFilter
  >
  implements OnInit
{
  languageService = inject(LanguageService);
  translateService = inject(TranslateService);
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  permissionReasonService = inject(PermissionReasonService);
  home: MenuItem | undefined;
  filterModel: PermissionReasonFilter = new PermissionReasonFilter();

  override get service() {
    return this.permissionReasonService;
  }

  override initListComponent(): void {
    // load lookups if needed
  }

  override openDialog(model: PermissionReason): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(PermissionReasonPopupComponent as any, model, viewMode);
  }

  addOrEditModel(permissionReason?: PermissionReason): void {
    this.openDialog(permissionReason ?? new PermissionReason());
  }
  protected override mapModelToExcelRow(model: PermissionReason): { [key: string]: any } {
    return {
      [this.translateService.instant('PERMISSION_PAGE.PERMISSION_REASON')]: model.getName(),
    };
  }
}
