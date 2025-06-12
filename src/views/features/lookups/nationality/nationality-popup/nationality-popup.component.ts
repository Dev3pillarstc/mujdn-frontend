import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nationality-popup',
  imports: [InputTextModule, ReactiveFormsModule],
  templateUrl: './nationality-popup.component.html',
  styleUrl: './nationality-popup.component.scss',
})
export class NationalityPopupComponent extends BasePopupComponent {}
