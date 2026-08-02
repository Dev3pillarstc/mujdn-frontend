import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { WeekDaysEnum } from '@/enums/week-days-enum';
import {
  GeneralSettings,
  GeneralSettingsNotificationChannels,
  GeneralSettingsWorkDays,
} from '@/models/features/setting/general-settings';
import { GeneralSettingsService } from '@/services/features/setting/general-settings.service';
import { AlertService } from '@/services/shared/alert.service';
import { weekDays } from '@/utils/general-helper';

@Component({
  selector: 'app-notification-channels',
  standalone: true,
  imports: [
    MatDialogModule,
    Breadcrumb,
    ReactiveFormsModule,
    TranslatePipe,
    RouterModule,
    InputNumberModule,
  ],
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export default class NotificationSettingsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(GeneralSettingsService);
  private readonly translateService = inject(TranslateService);
  private readonly alertService = inject(AlertService);

  breadcrumbs: MenuItem[] = [];
  home: MenuItem = this.setHomeItem();
  generalSettingsModel = new GeneralSettings();
  generalSettingsForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  hasLoadedSettings = false;
  weekDays = weekDays;

  notificationChannels = [
    { key: 'isSms', labelKey: 'NOTIFICATION.SMS' },
    { key: 'isEmail', labelKey: 'NOTIFICATION.EMAIL' },
    { key: 'isWeb', labelKey: 'NOTIFICATION.WEB' },
  ];

  ngOnInit(): void {
    this.buildForm();
    this.loadGeneralSettings();

    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.home = this.setHomeItem();
      this.setBreadcrumbs();
    });

    this.setBreadcrumbs();
  }

  getFormControlName(dayValue: WeekDaysEnum): string {
    return WeekDaysEnum[dayValue].toLowerCase();
  }

  loadGeneralSettings(): void {
    this.isLoading = true;
    this.hasLoadedSettings = false;
    this.generalSettingsForm.disable();

    this.service
      .getSettings()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.generalSettingsForm.enable();
        })
      )
      .subscribe({
        next: (settings) => {
          this.setGeneralSettings(settings);
          this.hasLoadedSettings = true;
        },
      });
  }

  save(): void {
    if (
      this.generalSettingsForm.invalid ||
      !this.hasLoadedSettings ||
      this.isLoading ||
      this.isSaving
    ) {
      this.generalSettingsForm.markAllAsTouched();
      return;
    }

    if (!this.hasConcurrencyVersions()) {
      this.alertService.showErrorMessage({
        messages: ['NOTIFICATION.SETTINGS_STALE_RELOAD'],
      });
      this.loadGeneralSettings();
      return;
    }

    this.isSaving = true;
    this.generalSettingsForm.disable();
    const settings = this.prepareSettings();

    this.service
      .updateSettings(settings)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          if (!this.isLoading) {
            this.generalSettingsForm.enable();
          }
        })
      )
      .subscribe({
        next: (result) => {
          this.setGeneralSettings(result);
          this.alertService.showSuccessMessage({
            messages: ['COMMON.SAVED_SUCCESSFULLY'],
          });
        },
        error: (error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 409) {
            this.loadGeneralSettings();
          }
        },
      });
  }

  reset(): void {
    if (!this.hasLoadedSettings || this.isLoading || this.isSaving) {
      return;
    }

    this.patchForm(this.generalSettingsModel);
  }

  private buildForm(): void {
    this.generalSettingsForm = this.fb.group({
      notificationChannels: this.fb.group({
        isSms: [false],
        isEmail: [false],
        isWeb: [false],
      }),
      workDays: this.fb.group({
        sunday: [false],
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        saturday: [false],
      }),
      graceMonthlyMinutes: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(2147483647),
          Validators.pattern(/^\d+$/),
        ],
      ],
      graceDailyMaxMinutes: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(2147483647),
          Validators.pattern(/^\d+$/),
        ],
      ],
      monthlyPermissionLimit: [
        null,
        [Validators.required, Validators.min(1), Validators.max(31), Validators.pattern(/^\d+$/)],
      ],
    });
  }

  private prepareSettings(): GeneralSettings {
    const value = this.generalSettingsForm.getRawValue();

    return Object.assign(new GeneralSettings(), {
      workDays: Object.assign(
        new GeneralSettingsWorkDays(),
        this.generalSettingsModel.workDays,
        value.workDays
      ),
      notificationChannels: Object.assign(
        new GeneralSettingsNotificationChannels(),
        this.generalSettingsModel.notificationChannels,
        value.notificationChannels
      ),
      graceMonthlyMinutes: value.graceMonthlyMinutes,
      graceDailyMaxMinutes: value.graceDailyMaxMinutes,
      monthlyPermissionLimit: value.monthlyPermissionLimit,
    });
  }

  private setGeneralSettings(settings: GeneralSettings): void {
    this.generalSettingsModel = Object.assign(new GeneralSettings(), settings, {
      workDays: Object.assign(new GeneralSettingsWorkDays(), settings.workDays),
      notificationChannels: Object.assign(
        new GeneralSettingsNotificationChannels(),
        settings.notificationChannels
      ),
    });
    this.patchForm(this.generalSettingsModel);
  }

  private patchForm(settings: GeneralSettings): void {
    this.generalSettingsForm.reset({
      notificationChannels: {
        isSms: settings.notificationChannels.isSms,
        isEmail: settings.notificationChannels.isEmail,
        isWeb: settings.notificationChannels.isWeb,
      },
      workDays: {
        sunday: settings.workDays.sunday,
        monday: settings.workDays.monday,
        tuesday: settings.workDays.tuesday,
        wednesday: settings.workDays.wednesday,
        thursday: settings.workDays.thursday,
        friday: settings.workDays.friday,
        saturday: settings.workDays.saturday,
      },
      graceMonthlyMinutes: settings.graceMonthlyMinutes,
      graceDailyMaxMinutes: settings.graceDailyMaxMinutes,
      monthlyPermissionLimit: settings.monthlyPermissionLimit,
    });
    this.generalSettingsForm.markAsPristine();
  }

  private hasConcurrencyVersions(): boolean {
    return Boolean(
      this.generalSettingsModel.workDays.concurrencyUpdateVersion &&
        this.generalSettingsModel.notificationChannels.concurrencyUpdateVersion
    );
  }

  private setHomeItem(): MenuItem {
    return {
      label: this.translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }

  private setBreadcrumbs(): void {
    this.breadcrumbs = [{ label: this.translateService.instant('NOTIFICATION.GENERAL_SETTINGS') }];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
