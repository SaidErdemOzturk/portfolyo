import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProjectDto } from 'src/app/models/projectDto';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProjectService } from 'src/app/services/api/project.service';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss']
})
export class ProyectsComponent implements OnInit {

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

  projects:ProjectDto[]
  localhostImagePath="http://api.saiderdemozturk.com/Uploads/Images/";
  isLoading:boolean=false; 

  constructor(
    public analyticsService: AnalyticsService,
    private projectService:ProjectService
  ) { 
  
    this.projectService.getProjectsDto().subscribe(response=>{
      this.projects=response.data
      this.isLoading=true;
      console.log("response")
      console.log(response)
    })


  }

  ngOnInit(): void {
   if(this.projects){
    this.isLoading=false
   }
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
