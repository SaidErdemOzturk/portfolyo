import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { from, of, Subscription } from 'rxjs';
import { catchError, concatMap, finalize, toArray } from 'rxjs/operators';
import { Project } from 'src/app/models/project';
import { ProjectDto } from 'src/app/models/projectDto';
import { Image } from 'src/app/models/image';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { ImageService } from 'src/app/services/api/image.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { AuthTokenStorageService } from 'src/app/services/auth/auth-token-storage.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 600,
    autoplaySpeed: 600,
    items: 1,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true
  }

  @ViewChild('imgContainer') imgContainer: ElementRef;

  projects: ProjectDto[] = [];
  localhostImagePath = "http://api.saiderdemozturk.com/Uploads/Images/";
  isLoading = true;
  isSaving = false;
  isAddMode = false;
  isEditMode = false;
  isAuthenticated = false;

  newProject: Project = {
    id: 0,
    title: '',
    description: '',
    ghLink: '',
    demoLink: ''
  };
  newProjectImageFiles: File[] = [];
  newProjectImagePreviews: string[] = [];

  editingProject: Project | null = null;
  editingProjectImageFiles: File[] = [];
  editingProjectImagePreviews: string[] = [];
  editingProjectExistingImages: Image[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    public analyticsService: AnalyticsService,
    private projectService: ProjectService,
    private imageService: ImageService,
    private loadingService: LoadingService,
    private authTokenStorage: AuthTokenStorageService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.loadingService.loading$.subscribe(
        (loading) => {
          this.isLoading = loading;
        }
      )
    );

    this.subscription.add(
      this.projectService.editProject$.subscribe((project) => {
        if (project) {
          this.enableEditMode(project);
        }
      })
    );

    this.isAuthenticated = !!this.authTokenStorage.getAccessToken();
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadProjects(callback?: () => void): void {
    this.projectService.getProjectsDto().subscribe({
      next: (response) => {
        this.projects = response.data;
        if (callback) callback();
      },
      error: (error) => {
        console.error('Projeler yüklenirken hata oluştu:', error);
      }
    });
  }

  enableAddMode(): void {
    if (!this.isAuthenticated) return;
    this.newProject = {
      id: 0,
      title: '',
      description: '',
      ghLink: '',
      demoLink: ''
    };
    this.newProjectImageFiles = [];
    this.newProjectImagePreviews = [];
    this.isAddMode = true;
    this.isEditMode = false;
    this.editingProject = null;
  }

  cancelAdd(): void {
    this.newProject = {
      id: 0,
      title: '',
      description: '',
      ghLink: '',
      demoLink: ''
    };
    this.newProjectImageFiles = [];
    this.newProjectImagePreviews = [];
    this.isAddMode = false;
  }

  enableEditMode(project: any): void {
    if (!this.isAuthenticated) return;
    console.log("")
    this.editingProject = {
      id: project.projectId,
      title: project.title,
      description: project.description,
      ghLink: project.ghLink,
      demoLink: project.demoLink
    };

    const foundProject = this.projects.find(p => p.id === project.id);
    this.editingProjectExistingImages = (project as any).images || foundProject?.images || [];
    this.editingProjectImageFiles = [];
    this.editingProjectImagePreviews = [];

    this.isEditMode = true;
    this.isAddMode = false;

    setTimeout(() => {
      const el = document.getElementById('project-edit-panel') || document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  cancelEdit(): void {
    this.editingProject = null;
    this.editingProjectImageFiles = [];
    this.editingProjectImagePreviews = [];
    this.editingProjectExistingImages = [];
    this.isEditMode = false;
  }

  onEditProjectImagesChange(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const selected = Array.from(files);
      for (const file of selected) {
        const alreadyExists = this.editingProjectImageFiles.some(
          f => f.name === file.name && f.size === file.size
        );
        if (!alreadyExists) {
          this.editingProjectImageFiles.push(file);

          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              this.editingProjectImagePreviews.push(reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
    if (event.target) {
      event.target.value = '';
    }
  }

  removeEditingProjectSelectedImage(index: number): void {
    this.editingProjectImageFiles.splice(index, 1);
    this.editingProjectImagePreviews.splice(index, 1);
  }

  deleteEditingProjectImage(imageId: number): void {
    if (!this.isAuthenticated || this.isSaving) return;

    this.isSaving = true;
    this.imageService.delete(imageId)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.editingProjectExistingImages = this.editingProjectExistingImages.filter(img => img.id !== imageId);
            this.loadProjects();
            this.projectService.notifyProjectsUpdated();
          }
        },
        error: (error) => {
          console.error('Görsel silinirken hata oluştu:', error);
        }
      });
  }

  updateProject(): void {
    if (!this.isAuthenticated || !this.editingProject || this.isSaving) return;
    if (!this.editingProject.title.trim()) return;
    this.isSaving = true;
    const projectId = this.editingProject.id;
    const imagesToUpload = [...this.editingProjectImageFiles];

    this.projectService
      .update(this.editingProject)
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (imagesToUpload.length > 0) {
              from(imagesToUpload)
                .pipe(
                  concatMap(file =>
                    this.imageService.add(file, projectId).pipe(
                      catchError(err => {
                        console.error(`Görsel yüklenirken hata (${file.name}):`, err);
                        return of(null);
                      })
                    )
                  ),
                  toArray(),
                  finalize(() => (this.isSaving = false))
                )
                .subscribe({
                  next: () => {
                    this.cancelEdit();
                    this.loadProjects();
                    this.projectService.notifyProjectsUpdated();
                  },
                  error: (err) => {
                    console.error('Görseller yüklenirken hata:', err);
                    this.cancelEdit();
                    this.loadProjects();
                    this.projectService.notifyProjectsUpdated();
                  }
                });
            } else {
              this.isSaving = false;
              this.cancelEdit();
              this.loadProjects();
              this.projectService.notifyProjectsUpdated();
            }
          } else {
            this.isSaving = false;
          }
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Proje güncellenirken hata oluştu:', error);
        }
      });
  }

  deleteProject(project?: any | null): void {
    const targetProject = project || this.editingProject;
    if (!this.isAuthenticated || !targetProject || this.isSaving) return;

    if (!confirm(`"${targetProject.title}" projesini silmek istediğinize emin misiniz?`)) {
      return;
    }

    this.isSaving = true;
    this.projectService
      .delete({
        id: targetProject.projectId,
        title: targetProject.title,
        description: targetProject.description || '',
        ghLink: targetProject.ghLink || '',
        demoLink: targetProject.demoLink || ''
      })
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (this.isEditMode && this.editingProject?.id === targetProject.id) {
              this.cancelEdit();
            }
            this.loadProjects();
            this.projectService.notifyProjectsUpdated();
          }
        },
        error: (error) => {
          console.error('Proje silinirken hata oluştu:', error);
        }
      });
  }

  onNewProjectImagesChange(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const selected = Array.from(files);
      for (const file of selected) {
        const alreadyExists = this.newProjectImageFiles.some(
          f => f.name === file.name && f.size === file.size
        );
        if (!alreadyExists) {
          this.newProjectImageFiles.push(file);

          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              this.newProjectImagePreviews.push(reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
    if (event.target) {
      event.target.value = '';
    }
  }

  removeNewProjectImage(index: number): void {
    this.newProjectImageFiles.splice(index, 1);
    this.newProjectImagePreviews.splice(index, 1);
  }

  private extractProjectId(response: any): number | null {
    if (!response) return null;
    const rawData = response.data;
    const candidates = [
      rawData?.projectId,
      rawData?.ProjectId,
      rawData?.id,
      rawData?.Id,
      typeof rawData === 'number' ? rawData : null,
      response.projectId,
      response.ProjectId,
      response.id,
      response.Id
    ];

    for (const val of candidates) {
      if (val !== null && val !== undefined && !isNaN(Number(val)) && Number(val) > 0) {
        return Number(val);
      }
    }
    return null;
  }

  addProject(): void {
    if (!this.isAuthenticated || this.isSaving) return;
    if (!this.newProject.title.trim()) return;

    this.isSaving = true;
    const imagesToUpload = [...this.newProjectImageFiles];

    this.projectService
      .add(this.newProject)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const projectId = this.extractProjectId(response);

            if (projectId && imagesToUpload.length > 0) {
              from(imagesToUpload)
                .pipe(
                  concatMap(file =>
                    this.imageService.add(file, projectId).pipe(
                      catchError(err => {
                        console.error(`Resim yüklenirken hata (${file.name}):`, err);
                        return of(null);
                      })
                    )
                  ),
                  toArray(),
                  finalize(() => (this.isSaving = false))
                )
                .subscribe({
                  next: () => {
                    this.cancelAdd();
                    this.loadProjects();
                    this.projectService.notifyProjectsUpdated();
                  },
                  error: (err) => {
                    console.error('Resimler yüklenirken hata:', err);
                    this.cancelAdd();
                    this.loadProjects();
                    this.projectService.notifyProjectsUpdated();
                  }
                });
            } else {
              this.isSaving = false;
              this.cancelAdd();
              this.loadProjects();
              this.projectService.notifyProjectsUpdated();
            }
          } else {
            this.isSaving = false;
          }
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Proje eklenirken hata oluştu:', error);
        }
      });
  }

  debug() {
    if (this.imgContainer?.nativeElement?.scroll) {
      this.imgContainer.nativeElement.scroll({
        top: this.imgContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  setImage(imagePath?: string): string {
    if (!imagePath) return '';
    return this.localhostImagePath + imagePath;
  }

}

