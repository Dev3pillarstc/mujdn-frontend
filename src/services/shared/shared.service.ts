import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _sideMenuToggle: Subject<void> = new Subject<void>();

  sideMenuToggle$ = this._sideMenuToggle;

  toggleSideMenu(): void {
    this._sideMenuToggle.next();
  }
}
