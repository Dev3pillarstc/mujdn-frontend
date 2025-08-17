import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private loadingCount = 0;

  show(): void {
    setTimeout(() => {
      this.loadingCount++;
      if (this.loadingCount === 1) {
        this.loadingSubject.next(true);
      }
    });
  }

  hide(): void {
    setTimeout(() => {
      this.loadingCount--;
      if (this.loadingCount <= 0) {
        this.loadingCount = 0;
        this.loadingSubject.next(false);
      }
    });
  }

  // Force hide (useful for error scenarios)
  forceHide(): void {
    setTimeout(() => {
      this.loadingCount = 0;
      this.loadingSubject.next(false);
    });
  }
}
