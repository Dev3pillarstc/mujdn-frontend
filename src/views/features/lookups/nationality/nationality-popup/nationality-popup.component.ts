import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-nationality-popup',
  imports: [InputTextModule],
  templateUrl: './nationality-popup.component.html',
  styleUrl: './nationality-popup.component.scss',
})
export class NationalityPopupComponent extends BasePopupComponent {}
