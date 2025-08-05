import { UserProfile } from '@/models/features/user-profile/user-profile';
import { UserProfileService } from '@/services/features/user-profile.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const userProfileResolver: ResolveFn<UserProfile | null> = () => {
  const userProfileService = inject(UserProfileService);
  return userProfileService.getMyProfile().pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
