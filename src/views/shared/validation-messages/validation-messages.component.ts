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
    const message = this.validationMessages[key as ValidationErrorKeyEnum];

    if (!message) return null;

    // Handle dynamic messages with parameters
    const error = this.control().errors?.[key];
    if (error && typeof error === 'object') {
      return this.formatMessage(message, error);
    }

    return message;
  }

  private formatMessage(message: string, errorData: any): string {
    // Handle maxlength and minlength with dynamic values
    if (errorData.requiredLength !== undefined) {
      return message.replace('{length}', errorData.requiredLength.toString());
    }

    // Handle number range validation
    if (errorData.min !== undefined && errorData.max !== undefined) {
      return message
        .replace('{min}', errorData.min.toString())
        .replace('{max}', errorData.max.toString());
    }

    return message;
  }

  validationMessages: Record<ValidationErrorKeyEnum, string> = {
    [ValidationErrorKeyEnum.REQUIRED]: 'COMMON.REQUIRED_FIELD',
    [ValidationErrorKeyEnum.AR_NUM]: 'COMMON.ARABIC_ONLY',
    [ValidationErrorKeyEnum.ENG_NUM]: 'COMMON.ENGLISH_ONLY',
    [ValidationErrorKeyEnum.MIN_LENGTH]: 'COMMON.MIN_LENGTH',
    [ValidationErrorKeyEnum.MAX_LENGTH]: 'COMMON.MAX_LENGTH',
    [ValidationErrorKeyEnum.START_AFTER_END]: 'COMMON.START_BEFORE_END',
    [ValidationErrorKeyEnum.TIME_FROM_AFTER_TIME_TO]: 'COMMON.TIME_FROM_BEFORE_TIME_TO',
    [ValidationErrorKeyEnum.EMAIL]: 'COMMON.EMAIL_VALIDATION',
    [ValidationErrorKeyEnum.STRONG_PASSWORD]: 'COMMON.STRONG_PASSWORD',
    [ValidationErrorKeyEnum.NATIONAL_ID]: 'COMMON.NATIONAL_ID_VALIDATION',
    [ValidationErrorKeyEnum.PHONE_NUMBER]: 'COMMON.PHONE_NUMBER_VALIDATION',
    [ValidationErrorKeyEnum.POSITIVE_NUMBER]: 'COMMON.POSITIVE_NUMBER_ONLY',
    [ValidationErrorKeyEnum.INVALID_NUMBER]: 'COMMON.INVALID_NUMBER',
    [ValidationErrorKeyEnum.NUMBER_RANGE]: 'COMMON.NUMBER_RANGE',
  };
}
