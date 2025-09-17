import { DevicesConfiguration } from '@/models/features/business/devices-configuration';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { DevicesConfigurationService } from '@/services/features/business/devices-configuration.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const devicesConfigurationResolver: ResolveFn<
  PaginatedList<DevicesConfiguration> | null
> = () => {
  const devicesConfigurationService = inject(DevicesConfigurationService);
  return devicesConfigurationService.loadPaginated(new PaginationParams()).pipe(
    catchError(() => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
