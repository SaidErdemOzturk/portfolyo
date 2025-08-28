import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectWithTech } from 'src/app/models/projectWithTech';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-more-projects',
  templateUrl: './more-projects.component.html',
  styleUrls: ['./more-projects.component.scss']
})
export class MoreProjectsComponent implements OnInit {


  projects:ProjectWithTech[]=[]


  isLoading = true;

  private subscription: Subscription;
  constructor(
    private router: Router,
    public analyticsService: AnalyticsService,
    private projectService:ProjectService,
    private loadingService:LoadingService
    ) { }

    ngOnInit() {

      this.subscription = this.loadingService.loading$.subscribe(
        (loading) => {
          this.isLoading = loading;
        }
      );

    
      this.projectService.getMoreProjectsDto().subscribe(response=>{
        console.log("git testi yapıyorum")
        this.projects=response.data
      })
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            
        });
    }
}
