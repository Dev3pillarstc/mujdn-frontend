import { Component, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, delay, map, Observable, of, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-validation-messages',
  imports: [TranslatePipe, AsyncPipe],
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
})
export class ValidationMessagesComponent implements OnInit {
  control = input.required<AbstractControl>();
  activeErrors$!: Observable<{ key: string; value: any }[]>;

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
}
