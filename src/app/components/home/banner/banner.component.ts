import { Component, OnInit, AfterViewInit } from '@angular/core';

import {trigger, state, style, animate, transition, stagger, query } from "@angular/animations"
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProfileService } from 'src/app/services/api/profile.service';
import { Profile } from 'src/app/models/profile';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: [
    trigger('bannerTrigger', [
      transition(":enter", [
        query("*", [
          style({ opacity: 0, transform: "translateX(-50px)" }),
          stagger(50, [
            animate(
              "250ms cubic-bezier(0.35, 0, 0.25, 1)",
              style({ opacity: 1, transform: "none" })
            )
          ])
        ])
      ])
    ])
  ]
})
export class BannerComponent implements OnInit {

  profile:Profile={description:"",fullName:"",id:1,jobName:"",moreDescription:""}
  isLoading:boolean
  constructor(
    public analyticsService: AnalyticsService,
    private profileService:ProfileService,

  ) {}

  ngOnInit(): void { 
    
    this.profileService.getProfile().subscribe(response=>{
      this.profile=response.data
    })
  }
  
}
