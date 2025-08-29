import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { ProjectDto } from 'src/app/models/projectDto';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 700,
    items: 1,
    autoplay: true,
    autoplayTimeout:3000
  }

  @ViewChild('imgContainer') imgContainer: ElementRef;

  projects:ProjectDto[]=[]
  localhostImagePath="http://api.saiderdemozturk.com/Uploads/Images/";
  isLoading = true;

  private subscription: Subscription;

  constructor(
    public analyticsService: AnalyticsService,
    private projectService:ProjectService,
    private loadingService:LoadingService

  ) {
    this.projectService.getProjectsDto().subscribe(response=>{
      this.projects=response.data
    })
  }

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );

    this.projectService.getProjectsDto().subscribe(response=>{
      this.projects=response.data
    })
  }

debug(){

  this.imgContainer.nativeElement.scroll({
    top: this.imgContainer.nativeElement.scrollHeight,
    left: 0,
    behavior: 'smooth',    
  });
}

setImage(imagePath:string){
return this.localhostImagePath+imagePath
}

}
