import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  language: 'tr' | 'en';

  constructor(
    public translateService: TranslateService,
  ) {}

  initLanguage(){
    this.translateService.addLangs(["en", "tr"])
    let language = navigator.language || (navigator as any).userLanguage;
    language = language.split("-").includes("tr") ? "tr" : "en";
    this.translateService.setDefaultLang(language);
    this.language = language;
  }

  changeLanguage(language: 'tr' | 'en'){
    this.translateService.setDefaultLang(language);
    this.language = language;
  }
}
