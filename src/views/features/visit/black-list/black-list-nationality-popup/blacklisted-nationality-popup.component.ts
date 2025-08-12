import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

@Component({
  selector: 'blacklisted-nationality-popup',
  imports: [Select],
  templateUrl: './blacklisted-nationality-popup.component.html',
  styleUrl: './blacklisted-nationality-popup.component.scss',
})
export class BlacklistedNationalityPopupComponent {}
