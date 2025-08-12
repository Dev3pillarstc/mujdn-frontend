import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-black-list-national-ids-popup',
  imports: [InputTextModule],
  templateUrl: './blacklisted-national-ids-popup.component.html',
  styleUrl: './blacklisted-national-ids-popup.component.scss',
})
export class BlackListNationalIdsPopupComponent {}
