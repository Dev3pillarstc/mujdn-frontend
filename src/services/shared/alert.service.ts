import { AlertDialogComponent } from '@/abstracts/base-components/alert-dialog/alert-dialog.component';
import { AlertDialogData } from '@/models/shared/alert-dialog-data';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { COOKIE_ENUM } from '@/enums/cookie-enum';
import { CookieService } from '@/services/shared/cookie.service';
import { AuthService } from '@/services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  matDialog = inject(MatDialog);
  cookieService = inject(CookieService);
  authService = inject(AuthService);
  router = inject(Router);

  showSuccessMessage(
    params: { icon?: string; messages?: string[]; buttonLabel?: string },
    dialogSize?: {
      width: string;
      maxWidth: string;
    }
  ) {
    const dialog = this.matDialog.open(AlertDialogComponent, {
      width: dialogSize?.width || '100%',
      maxWidth: dialogSize?.maxWidth || '400px',
      data: <AlertDialogData>{
        icon: params.icon || 'success',
        messages: params.messages || ['COMMON.SAVED_SUCCESSFULLY'],
        buttonLabel: params.buttonLabel || 'COMMON.OK',
      },
    });

    setTimeout(() => {
      dialog.close();
    }, 5000);

    return dialog;
  }

  showErrorMessage(
    params: { icon?: string; messages?: string[]; buttonLabel?: string },
    dialogSize?: {
      width: string;
      maxWidth: string;
    }
  ) {
    const dialog = this.matDialog.open(AlertDialogComponent, {
      width: dialogSize?.width || '100%',
      maxWidth: dialogSize?.maxWidth || '400px',
      data: <AlertDialogData>{
        icon: params.icon || 'error',
        messages: params.messages || ['COMMON.ERROR_OCCURRED'],
        buttonLabel: params.buttonLabel || 'COMMON.OK',
      },
    });

    setTimeout(() => {
      const userDataCookie = this.cookieService.getCookie(COOKIE_ENUM.USER_DATA);
      if (!userDataCookie) {
        this.authService.setUser(undefined);
        // this.authService.logout().subscribe(); // 🔁 You must implement this in AuthService
        this.router.navigate(['/auth/login']);
        this.matDialog.closeAll();
      }
      dialog.close();
    }, 5000);

    return dialog;
  }

  showErrorMessageWithRedirect(
    params: { icon?: string; messages?: string[]; buttonLabel?: string },
    dialogSize?: {
      width: string;
      maxWidth: string;
    }
  ) {
    const dialog = this.matDialog.open(AlertDialogComponent, {
      width: dialogSize?.width || '100%',
      maxWidth: dialogSize?.maxWidth || '400px',
      data: <AlertDialogData>{
        icon: params.icon || 'error',
        messages: params.messages || ['COMMON.ERROR_OCCURRED'],
        buttonLabel: params.buttonLabel || 'COMMON.OK',
      },
    });

    setTimeout(() => {
      dialog.close();
    }, 5000);

    return dialog;
  }
}
