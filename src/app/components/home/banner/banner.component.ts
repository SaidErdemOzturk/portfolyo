import { Component, OnInit, AfterViewInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import {trigger, state, style, animate, transition, stagger, query } from "@angular/animations"
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProfileService } from 'src/app/services/api/profile.service';
import { Profile } from 'src/app/models/profile';
import { AuthTokenStorageService } from 'src/app/services/auth/auth-token-storage.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Subscription } from 'rxjs';

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
  editedDescription = '';
  isLoading = true;
  isSaving = false;
  isEditMode = false;
  isAuthenticated = false;

  private subscription: Subscription;

  constructor(
    public analyticsService: AnalyticsService,
    private profileService:ProfileService,
    private loadingService:LoadingService,
    private authTokenStorage: AuthTokenStorageService

  ) {}

  ngOnInit(): void { 
    

    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );
    this.isAuthenticated = !!this.authTokenStorage.getAccessToken();

    this.profileService.getProfile().subscribe(response=>{
      this.profile=response.data
      this.editedDescription = this.profile.description ?? '';
    })
  }

  enableEditMode(): void {
    if (!this.isAuthenticated) return;
    this.editedDescription = this.profile.description ?? '';
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.editedDescription = this.profile.description ?? '';
    this.isEditMode = false;
  }

  saveDescription(): void {
    if (!this.isAuthenticated || this.isSaving) return;

    const updatedProfile: Profile = {
      ...this.profile,
      description: this.editedDescription,
    };

    this.isSaving = true;
    this.profileService
      .update(updatedProfile)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (response) => {
          this.profile = response.data ?? updatedProfile;
          this.editedDescription = this.profile.description ?? '';
          this.isEditMode = false;
        },
      });
  }
  
}
