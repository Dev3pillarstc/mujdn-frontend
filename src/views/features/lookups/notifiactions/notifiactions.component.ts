import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { NotificationFilter } from '@/models/features/setting/notificationFilter';
import { RegionService } from '@/services/features/lookups/region.service';
import { NotificationService } from '@/services/features/setting/notification.service';
import { Notification } from '@/models/features/setting/notification';
import { Select } from 'primeng/select';
import { NotificationTypeService } from '@/services/features/setting/notification-type.service';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

@Component({
  selector: 'app-notifiactions',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
    Select,
  ],
  templateUrl: './notifiactions.component.html',
  styleUrl: './notifiactions.component.scss',
})
export default class NotifiactionsComponent extends BaseListComponent<
  Notification,
  any,
  NotificationService,
  NotificationFilter
> {
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  notificationService = inject(NotificationService);
  filterModel: NotificationFilter = new NotificationFilter();
  notificationTypes: BaseLookupModel[] = [];
  notificationTypeService = inject(NotificationTypeService);
  override get service() {
    return this.notificationService;
  }

  override initListComponent(): void {
    this.notificationTypeService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.notificationTypes = res;
    });
  }
  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'NOTIFICATIONS_PAGE.NOTIFICATIONS' }];
  }

  override openDialog(model: Notification): void {}

  protected override mapModelToExcelRow(model: Notification): { [key: string]: any } {
    return {
      [this.translateService.instant('NOTIFICATIONS_PAGE.NOTIFICATION_TITLE_ARABIC')]:
        model.notificationType.arabicTitle,
      [this.translateService.instant('NOTIFICATIONS_PAGE.NOTIFICATION_TITLE_ENGLISH')]:
        model.notificationType.englishTitle,
      [this.translateService.instant('NOTIFICATIONS_PAGE.NOTIFICATION_CONTENT_ARABIC')]:
        model.contentAr,
      [this.translateService.instant('NOTIFICATIONS_PAGE.NOTIFICATION_CONTENT_ENGLISH')]:
        model.contentEn,
      [this.translateService.instant('NOTIFICATIONS_PAGE.NOTIFICATION_DATE')]: model.creationDate,
    };
  }
  set dateFrom(value: Date | null) {
    this.filterModel.dateFrom = value;

    // If dateTo is before dateFrom, reset or adjust it
    if (this.filterModel.dateTo && value && this.filterModel.dateTo < value) {
      this.filterModel.dateTo = null; // or set it to value
    }
  }
  get dateFrom(): Date | null | undefined {
    return this.filterModel.dateFrom;
  }
  getPropertyName() {
    return this.langService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }
}
