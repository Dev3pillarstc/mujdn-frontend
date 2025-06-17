import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { Directive, inject, OnInit } from '@angular/core';
import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { DialogRef } from '@angular/cdk/dialog';
import { FormGroup } from '@angular/forms';
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

@Directive()
export abstract class BasePopupComponent<Model extends BaseCrudModel<any, any, any>>
  implements OnInit
{
  abstract model: Model;
  abstract form: FormGroup;
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  save$: Subject<void> = new Subject();
  dialogRef = inject(DialogRef);

  constructor() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  ngOnInit() {
    this.initPopup();
    this.buildForm();
    this.listenToSave();
  }

  abstract initPopup(): void;

  abstract buildForm(): void;

  abstract saveFail(error: Error): void;

  abstract afterSave(model: Model, dialogRef: DialogRef): void;

  abstract beforeSave(model: Model, form: FormGroup): Observable<boolean> | boolean;

  abstract prepareModel(model: Model, form: FormGroup): Observable<Model> | Model;

  listenToSave() {
    this.save$
      // call before Save callback
      .pipe(
        switchMap(() => {
          const result = this.beforeSave(this.model, this.form);
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
              this.saveFail(error);
              return of({
                error: error,
                model,
              });
            })
          );
        })
      )
      .pipe(filter((value) => !value.hasOwnProperty('error')))
      .subscribe((model: Model) => {
        this.afterSave(model, this.dialogRef);
        this.dialogRef.close(DIALOG_ENUM.OK);
      });
  }

  close() {
    this.dialogRef.close();
  }
}
