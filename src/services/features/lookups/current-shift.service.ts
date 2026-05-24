import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { BehaviorSubject, catchError, distinctUntilChanged, filter, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { MyShiftsService } from './my-shifts.service';
import { WorkDaysSettingService } from '../setting/work-days-setting.service';
import { AuthService } from '@/services/auth/auth.service';
import { LanguageService } from '@/services/shared/language.service';
import EmployeeShift from '@/models/features/lookups/work-shifts/employee-shift';
import { WorkDaysSetting } from '@/models/features/setting/work-days-setting';
import { changeTimeSuffix, formatTimeTo12Hour } from '@/utils/general-helper';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { isShiftWorkingDay } from '@/utils/shift-helper';
import { SKIP_LOADING } from '@/http-interceptors/loading.interceptor';

/** Shared HttpContext that tells the loading interceptor to skip the global spinner. */
const SILENT_CONTEXT = new HttpContext().set(SKIP_LOADING, true);

@Injectable({ providedIn: 'root' })
export class CurrentShiftService implements OnDestroy {
  private readonly myShiftsService = inject(MyShiftsService);
  private readonly workDaysSettingService = inject(WorkDaysSettingService);
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);

  private readonly destroy$ = new Subject<void>();

  // ─── State ────────────────────────────────────────────────────────────────────
  private readonly _currentShift$ = new BehaviorSubject<EmployeeShift | null>(null);
  private readonly _defaultWorkDays$ = new BehaviorSubject<WorkDaysSetting>(new WorkDaysSetting());

  // Public read-only observables
  readonly currentShift$ = this._currentShift$.asObservable();
  readonly defaultWorkDays$ = this._defaultWorkDays$.asObservable();

  // Subject that drives the load pipeline; switchMap ensures stale in-flight
  // requests are cancelled when a newer load is triggered.
  private readonly loadTrigger$ = new Subject<void>();

  constructor() {
    // ── Load pipeline ──────────────────────────────────────────────────────────
    // All HTTP calls carry SILENT_CONTEXT, so the global spinner is never shown.
    this.loadTrigger$
      .pipe(
        switchMap(() =>
          forkJoin({
            shift: this.myShiftsService
              .getMyCurrentShift(SILENT_CONTEXT)
              .pipe(catchError(() => of(null))),
            workDays: this.workDaysSettingService
              .getWorkDays(SILENT_CONTEXT)
              .pipe(catchError(() => of(new WorkDaysSetting()))),
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ shift, workDays }) => {
          if (shift) {
            this.applyFormattedTimes(shift);
          }
          this._currentShift$.next(shift ?? null);
          this._defaultWorkDays$.next(workDays);
        },
      });

    // ── Auto-load when the user becomes authenticated ──────────────────────────
    // BehaviorSubject emits immediately, so if the user is already logged in
    // (e.g. page refresh with a valid session), this fires right away.
    this.authService
      .getUser()
      .pipe(
        distinctUntilChanged((prev, curr) => !!prev === !!curr),
        filter((user) => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.load());

    // ── Reformat displayed times on language switch ────────────────────────────
    this.languageService.languageChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.reformatTimes());
  }

  /** Trigger a fresh silent fetch. Cancels any in-flight request. */
  load(): void {
    this.loadTrigger$.next();
  }

  /** Explicit alias used when the user opens the shift panel. */
  refresh(): void {
    this.load();
  }

  // ─── Snapshot getters ────────────────────────────────────────────────────────

  get currentShift(): EmployeeShift | null {
    return this._currentShift$.value;
  }

  get defaultWorkDays(): WorkDaysSetting {
    return this._defaultWorkDays$.value;
  }

  // ─── Derived helpers (consumed by HeaderComponent) ───────────────────────────

  isTodayWorkingDay(shift: EmployeeShift): boolean {
    return isShiftWorkingDay(
      shift.workShiftType,
      shift.startDate,
      new Date(),
      shift.employeeWorkingDays,
      this._defaultWorkDays$.value as any
    );
  }

  getFormattedPresenceTime(shift: EmployeeShift, lang: string): string {
    const locale: 'en-US' | 'ar-EG' = lang === LANGUAGE_ENUM.ENGLISH ? 'en-US' : 'ar-EG';
    return formatTimeTo12Hour(shift.presenceInquiryTime || '', locale);
  }

  // ─── Private ──────────────────────────────────────────────────────────────────

  /**
   * Writes 12-hour AM/PM strings to `formattedTimeFrom` / `formattedTimeTo`.
   * UTC → local conversion is already handled by `MyShiftsInterceptor`; only
   * formatting is done here.
   */
  private applyFormattedTimes(shift: EmployeeShift): void {
    const isEnglish = () => this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH;
    changeTimeSuffix(isEnglish, shift, 'timeFrom', 'formattedTimeFrom');
    changeTimeSuffix(isEnglish, shift, 'timeTo', 'formattedTimeTo');
  }

  /** Re-formats the cached shift on language change without hitting the backend. */
  private reformatTimes(): void {
    const shift = this._currentShift$.value;
    if (!shift) return;
    this.applyFormattedTimes(shift);
    // Emit a shallow copy so Angular change-detection picks up the update.
    this._currentShift$.next({ ...shift } as EmployeeShift);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
