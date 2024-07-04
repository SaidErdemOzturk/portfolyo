import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Profile } from 'src/app/models/profile';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProfileService } from 'src/app/services/api/profile.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  profile: Profile = { description: "", fullName: "", id: 1, jobName: "", moreDescription: "" }
  isLoading = true;
  private subscription: Subscription;

  constructor(
    public analyticsService: AnalyticsService,
    private profileService:ProfileService,
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {

    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );
   
    this.profileService.getProfile().subscribe(response=>{
      this.profile=response.data
    })
  }

}
