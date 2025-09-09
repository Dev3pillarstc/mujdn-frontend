import { Inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScrollToTopPaginationService {
  private readonly PAGINATOR_SELECTOR = 'p-paginator';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone
  ) {
    this.initialize();
  }

  private initialize() {
    this.zone.runOutsideAngular(() => {
      this.document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target) return;

        // Detect paginator click
        const paginator = target.closest(this.PAGINATOR_SELECTOR);
        if (paginator) {
          setTimeout(() => this.scrollTableAbovePaginator(paginator as HTMLElement), 50);
        }
      });
    });
  }

  private scrollTableAbovePaginator(paginator: HTMLElement) {
    /**
     * Find the closest table (`p-table`) above the paginator
     */
    const parentContainer = paginator.parentElement;
    if (!parentContainer) return;

    const table = document.querySelector('table') as HTMLElement;

    if (table) {
      const elementPosition = table.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    } else {
      // fallback - scroll page
      const scrollElement = this.document.scrollingElement || this.document.documentElement;
      scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
