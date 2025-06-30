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
import { TranslatePipe } from '@ngx-translate/core';
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
  languageService = inject(LanguageService); // Assuming you have a LanguageService to handle language changes
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
    const viewMode = model ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(PermissionReasonPopupComponent as any, model, viewMode);
  }

  addOrEditModel(permissionReason?: PermissionReason) {
    permissionReason = permissionReason || new PermissionReason();
    this.openDialog(permissionReason);
  }

  protected override mapModelToExcelRow(model: PermissionReason): { [key: string]: any } {
    const lang = this.languageService.getCurrentLanguage(); // 'ar' or 'en'

    return {
      [lang === LANGUAGE_ENUM.ARABIC ? 'سبب الإذن' : '؛Permission Reason']:
        lang === LANGUAGE_ENUM.ARABIC ? model.nameAr : model.nameEn,
    };
  }
}
