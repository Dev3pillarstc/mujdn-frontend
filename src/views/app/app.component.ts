import {Component, inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from '@/services/shared/local-storage.service';
import {LOCALSTORAGE_ENUM} from '@/enums/local-storage-enum';
import {LANGUAGE_ENUM} from '@/enums/language-enum';
import {LAYOUT_DIRECTION_ENUM} from '@/enums/layout-direction-enum';
import {RouterOutlet} from '@angular/router';
import {SpinnerComponent} from '../shared/spinner/spinner.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  private localStorageService = inject(LocalStorageService);
  declare direction: string;

  ngOnInit() {
    this.translate.addLangs([LANGUAGE_ENUM.ENGLISH, LANGUAGE_ENUM.ARABIC]);
    const currentLanguage = this.localStorageService.get(LOCALSTORAGE_ENUM.LANGUAGE);
    currentLanguage && this.translate.use(currentLanguage);
    !currentLanguage && this.translate.use(LANGUAGE_ENUM.ENGLISH) && this.localStorageService.set(LOCALSTORAGE_ENUM.LANGUAGE, LANGUAGE_ENUM.ENGLISH);

    this.translate.onLangChange.subscribe(event => {
      event.lang == LANGUAGE_ENUM.ARABIC && (this.direction = LAYOUT_DIRECTION_ENUM.RTL) || (this.direction = LAYOUT_DIRECTION_ENUM.LTR);
    });
  }
}
