import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GeneralSettings } from '@/models/features/setting/general-settings';
import { GeneralSettingsService } from '@/services/features/setting/general-settings.service';

export const generalSettingsResolver: ResolveFn<GeneralSettings> = () => {
  return inject(GeneralSettingsService).getSettings();
};
