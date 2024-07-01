import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProfileService } from 'src/app/services/api/profile.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  profile: Profile = { description: "", fullName: "", id: 1, jobName: "", moreDescription: "" }

  constructor(
    public analyticsService: AnalyticsService,
    private profileService:ProfileService,
  ) { }

  ngOnInit(): void {
   
    this.profileService.getProfile().subscribe(response=>{
      this.profile=response.data
    })
  }

}
