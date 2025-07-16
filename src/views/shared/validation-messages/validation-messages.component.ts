import { Component, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ValidationErrorKeyEnum } from '@/enums/validation-error-key-enum';

@Component({
  selector: 'app-validation-messages',
  imports: [TranslatePipe, AsyncPipe],
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
})
export class ValidationMessagesComponent implements OnInit {
  control = input.required<AbstractControl>();
  activeErrors$!: Observable<{ key: string; value: any }[]>;
  errorKey = ValidationErrorKeyEnum;
  ngOnInit(): void {
    const ctrl = this.control();

    this.activeErrors$ = ctrl.statusChanges.pipe(
      startWith(null), // trigger immediately
      debounceTime(100),
      map(() => {
        const errors = ctrl.errors || {};
        return Object.entries(errors).map(([key, value]) => ({ key, value }));
      })
    );
  }
  getMessage(key: string): string | null {
    return this.validationMessages[key as ValidationErrorKeyEnum] || null;
  }

  validationMessages: Record<ValidationErrorKeyEnum, string> = {
    [ValidationErrorKeyEnum.REQUIRED]: 'COMMON.REQUIRED_FIELD',
    [ValidationErrorKeyEnum.AR_NUM]: 'COMMON.ARABIC_ONLY',
    [ValidationErrorKeyEnum.ENG_NUM]: 'COMMON.ENGLISH_ONLY',
    [ValidationErrorKeyEnum.MIN_LENGTH]: 'COMMON.MIN_LENGTH',
    [ValidationErrorKeyEnum.MAX_LENGTH]: 'COMMON.MAX_LENGTH',
    [ValidationErrorKeyEnum.START_AFTER_END]: 'COMMON.START_BEFORE_END',
    [ValidationErrorKeyEnum.STRONG_PASSWORD]: 'COMMON.STRONG_PASSWORD',
  };
}
