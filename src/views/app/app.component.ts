import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from '@/services/shared/local-storage.service';
import {LOCALSTORAGE_ENUM} from '@/enums/local-storage-enum';
import {LANGUAGE_ENUM} from '@/enums/language-enum';
import {LAYOUT_DIRECTION_ENUM} from '@/enums/layout-direction-enum';
import {SpinnerComponent} from '../shared/spinner/spinner.component';
import {CommonModule} from '@angular/common';
import {LanguageService} from '@/services/shared/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);
  private languageService = inject(LanguageService);
  private localStorageService = inject(LocalStorageService);
  declare direction: string;

  ngOnInit() {
    this.translateService.addLangs([LANGUAGE_ENUM.ENGLISH, LANGUAGE_ENUM.ARABIC]);
    const currentSavedLanguage = this.localStorageService.get(LOCALSTORAGE_ENUM.LANGUAGE);
    this.languageService.setLanguage(currentSavedLanguage);

    this.translateService.onLangChange.subscribe(event => {
      event.lang == LANGUAGE_ENUM.ARABIC && (this.direction = LAYOUT_DIRECTION_ENUM.RTL) || (this.direction = LAYOUT_DIRECTION_ENUM.LTR);
    });
  }
}
