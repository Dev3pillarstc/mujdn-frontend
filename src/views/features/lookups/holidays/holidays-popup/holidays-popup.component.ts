import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { User } from '@/models/auth/user';
import { DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-holidays-popup',
  imports: [DatePickerModule, InputTextModule, CommonModule, FormsModule],
  templateUrl: './holidays-popup.component.html',
  styleUrl: './holidays-popup.component.scss',
})
export class HolidaysPopupComponent extends BasePopupComponent<User> implements OnInit {
  declare model: User;
  declare form: FormGroup;
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;

  override initPopup(): void {}

  override buildForm(): void {}

  override saveFail(error: Error): void {}

  override afterSave(model: User, dialogRef: DialogRef): void {}

  override beforeSave(model: User, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }

  override prepareModel(model: User, form: FormGroup): User | Observable<User> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }
}
