import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectWithTech } from 'src/app/models/projectWithTech';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { AuthTokenStorageService } from 'src/app/services/auth/auth-token-storage.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-more-projects',
  templateUrl: './more-projects.component.html',
  styleUrls: ['./more-projects.component.scss']
})
export class MoreProjectsComponent implements OnInit, OnDestroy {

  projects: ProjectWithTech[] = [];
  isLoading = true;
  isAuthenticated = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    public analyticsService: AnalyticsService,
    private projectService: ProjectService,
    private loadingService: LoadingService,
    private authTokenStorage: AuthTokenStorageService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = !!this.authTokenStorage.getAccessToken();

    this.subscription.add(
      this.loadingService.loading$.subscribe((loading) => {
        this.isLoading = loading;
      })
    );

    this.loadMoreProjects();

    this.subscription.add(
      this.projectService.projectsUpdated$.subscribe(() => {
        this.loadMoreProjects();
      })
    );

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadMoreProjects(): void {
    this.projectService.getMoreProjectsDto().subscribe({
      next: (response) => {
        this.projects = response.data;
      },
      error: (error) => {
        console.error('Diğer projeler yüklenirken hata oluştu:', error);
      }
    });
  }

  editProject(project: any, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (!this.isAuthenticated) return;

    this.projectService.setEditProject({
      id: project.projectId,
      title: project.title,
      description: project.description,
      ghLink: project.ghLink,
      demoLink: project.demoLink
    });
  }

  deleteProject(project: any, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (!this.isAuthenticated) return;

    if (!confirm(`"${project.title}" projesini silmek istediğinize emin misiniz?`)) {
      return;
    }

    this.projectService
      .delete({
        id: project.projectId,
        title: project.title,
        description: project.description || '',
        ghLink: project.ghLink || '',
        demoLink: project.demoLink || ''
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadMoreProjects();
            this.projectService.notifyProjectsUpdated();
          }
        },
        error: (error) => {
          console.error('Proje silinirken hata oluştu:', error);
        }
      });
  }
}
