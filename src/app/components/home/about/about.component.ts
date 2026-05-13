import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Profile } from 'src/app/models/profile';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProfileService } from 'src/app/services/api/profile.service';
import { AuthTokenStorageService } from 'src/app/services/auth/auth-token-storage.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  profile: Profile = { description: "", fullName: "", id: 1, jobName: "", moreDescription: "" }
  editedDescription = '';
  isLoading = true;
  isSaving = false;
  isEditMode = false;
  isAuthenticated = false;
  private subscription: Subscription;

  constructor(
    public analyticsService: AnalyticsService,
    private profileService:ProfileService,
    private authTokenStorage: AuthTokenStorageService,
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {

    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );

    this.isAuthenticated = !!this.authTokenStorage.getAccessToken();
   
    this.profileService.getProfile().subscribe(response=>{
      this.profile=response.data
      this.editedDescription = response.data?.moreDescription ?? '';
    })
  }

  enableEditMode(): void {
    if (!this.isAuthenticated) return;
    this.editedDescription = this.profile.moreDescription ?? '';
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.editedDescription = this.profile.moreDescription ?? '';
    this.isEditMode = false;
  }

  saveDescription(): void {
    if (!this.isAuthenticated || this.isSaving) return;

    const updatedProfile: Profile = {
      ...this.profile,
      moreDescription: this.editedDescription,
    };

    this.isSaving = true;
    this.profileService
      .update(updatedProfile)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (response) => {
          this.profile = response.data ?? updatedProfile;
          this.editedDescription = this.profile.moreDescription ?? '';
          this.isEditMode = false;
        },
        error: () => {},
      });
  }
}
