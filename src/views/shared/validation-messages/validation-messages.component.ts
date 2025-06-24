import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-validation-messages',
  imports: [TranslatePipe],
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
})
export class ValidationMessagesComponent {
  control = input.required<AbstractControl>();
  getActiveErrors(): { key: string; value: any }[] {
    return Object.entries(this.control()?.errors || {}).map(([key, value]) => ({ key, value }));
  }
}
