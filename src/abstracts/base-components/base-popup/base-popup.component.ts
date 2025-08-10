import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { Directive, inject, OnInit } from '@angular/core';
import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import {
  catchError,
  exhaustMap,
  filter,
  isObservable,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { MatDialogRef } from '@angular/material/dialog';
import { markFormGroupTouched } from '@/utils/general-helper';

@Directive()
export abstract class BasePopupComponent<Model extends BaseCrudModel<any, any, any>>
  implements OnInit
{
  abstract model: Model;
  abstract form: FormGroup;
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  save$: Subject<void> = new Subject();
  dialogRef = inject(MatDialogRef);

  // Store original model data to restore on error
  private originalModelData: any;

  constructor() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  ngOnInit() {
    this.initPopup();
    this.buildForm();
    // Store original model data after initialization
    this.storeOriginalModelData();
    this.listenToSave();
  }

  abstract initPopup(): void;

  abstract buildForm(): void;

  abstract saveFail(error: Error): void;

  abstract afterSave(model: Model, dialogRef: MatDialogRef<any, any>): void;

  abstract beforeSave(model: Model, form: FormGroup): Observable<boolean> | boolean;

  abstract prepareModel(model: Model, form: FormGroup): Observable<Model> | Model;

  /**
   * Store a deep copy of the original model data
   */
  private storeOriginalModelData(): void {
    this.originalModelData = JSON.parse(JSON.stringify(this.model));
  }

  /**
   * Restore the original model data when save fails
   */
  private restoreOriginalModelData(): void {
    if (this.originalModelData) {
      // Restore the original model data
      Object.assign(this.model, this.originalModelData);

      // Reset the form to reflect the original data
      this.form.patchValue(this.originalModelData);
      this.form.markAsUntouched();
      this.form.markAsPristine();
    }
  }

  listenToSave() {
    this.save$
      // call before Save callback
      .pipe(
        switchMap(() => {
          const result = this.beforeSave(this.model, this.form);
          !result && markFormGroupTouched(this.form);
          return isObservable(result) ? result : of(result);
        })
      )
      // filter the return value from saveBeforeCallback and allow only the true
      .pipe(filter((value) => value))
      .pipe(
        switchMap((_) => {
          const result = this.prepareModel(this.model, this.form);
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(
        exhaustMap((model: Model) => {
          const save$ = (model as BaseCrudModel<any, any>).save();
          return save$.pipe(
            catchError((error) => {
              // Keep the modified data so user can see what caused the error
              this.saveFail(error);
              return of({
                error: error,
                model,
              });
            })
          );
        })
      )
      .pipe(
        filter((value) => {
          return (
            !value.hasOwnProperty('error') || (value.hasOwnProperty('error') && value.error == null)
          );
        })
      )
      .subscribe((model: Model) => {
        // Update the original model data after successful save
        this.storeOriginalModelData();
        this.afterSave(model, this.dialogRef);
        this.dialogRef.close(DIALOG_ENUM.OK);
      });
  }

  close() {
    // Restore original data when closing without saving
    this.restoreOriginalModelData();
    this.dialogRef.close();
  }
}
