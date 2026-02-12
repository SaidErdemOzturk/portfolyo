import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import {LanguageService} from "src/app/services/language/language.service"
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingService } from './services/loading/loading.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'saiderdemozturk-portfolio';
  isLoading=true
  isAuthPage = false;
  
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private translateService: TranslateService,
    private location: Location,
    private languageService: LanguageService,
    private loadingService:LoadingService,
    private router: Router
    ){
    }
  ngOnInit(): void{
    
    this.languageService.initLanguage()
    
    this.titleService.setTitle( "Said Erdem Öztürk | Frontend Developer" );

    this.metaService.addTags([
      {name: 'keywords', content: 'Software, developer'},
    ]);
    
    
    AOS.init(); 

    // Login sayfasında header/footer göstermeyelim
    this.isAuthPage = this.router.url.startsWith('/login');
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isAuthPage = e.urlAfterRedirects.startsWith('/login');
      });

  }
}
