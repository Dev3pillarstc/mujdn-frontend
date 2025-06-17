import { Component, inject, OnInit } from '@angular/core';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

@Component({
  selector: 'app-city-popup',
  imports: [],
  templateUrl: './city-popup.component.html',
  styleUrl: './city-popup.component.scss',
})
export class CityPopupComponent implements OnInit {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);

  ngOnInit(): void {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  close() {
    this.dialogRef.close();
  }
}
