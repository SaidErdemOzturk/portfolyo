import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProjectWithTech } from 'src/app/models/projectWithTech';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProjectService } from 'src/app/services/api/project.service';

@Component({
  selector: 'app-more-proyects',
  templateUrl: './more-proyects.component.html',
  styleUrls: ['./more-proyects.component.scss']
})
export class MoreProyectsComponent implements OnInit {


  projects:ProjectWithTech[]
  constructor(
    private router: Router,
    public analyticsService: AnalyticsService,
    private projectService:ProjectService
    ) { }

    ngOnInit() {
      this.projectService.getMoreProjectsDto().subscribe(response=>{
        console.log("responseresponseresponseresponse",response)
        this.projects=response.data
      })
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
    }
    redirect(route: string, event) {
      const id = event.target.id;
      if(id=='demoLink' || id=='ghLink'){
        return
      }
      window.open(route, '_blank');
    }

}
