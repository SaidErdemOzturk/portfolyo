import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, of, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Job } from 'src/app/models/job';
import { JobDescription } from 'src/app/models/jobDescription';
import { UpdateJobDto } from 'src/app/models/updateJobDto';
import { JobDescriptionService } from 'src/app/services/api/job-description.service';
import { JobService } from 'src/app/services/api/job.service';
import { AuthTokenStorageService } from 'src/app/services/auth/auth-token-storage.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {

  active = 0;
  jobs: Job[] = [];

  isLoading = true;
  isSaving = false;
  isEditMode = false;
  isAuthenticated = false;
  editingJob: Job | null = null;

  private subscription: Subscription;

  constructor(
    private jobService: JobService,
    private jobDescriptionService: JobDescriptionService,
    private loadingService: LoadingService,
    private datePipe: DatePipe,
    private authTokenStorage: AuthTokenStorageService
  ) { }

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );

    this.isAuthenticated = !!this.authTokenStorage.getAccessToken();

    this.jobService.getJobs().subscribe(response => {
      this.jobs = response.data;
      for (let i = 0; i < this.jobs.length; i++) {
        this.datePipe.transform(this.jobs[i].startedDate, 'dd.MM.yyyy');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  enableEditMode(job: Job): void {
    if (!this.isAuthenticated) return;
    this.editingJob = JSON.parse(JSON.stringify(job));
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.editingJob = null;
    this.isEditMode = false;
  }

  formatDateForInput(date: Date | string | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  }

  addDescription(): void {
    if (!this.editingJob) return;
    if (!this.editingJob.descriptions) {
      this.editingJob.descriptions = [];
    }
    this.editingJob.descriptions.push({
      jobId: this.editingJob.jobId,
      id: 0,
      description: ''
    });
  }

  removeDescription(index: number): void {
    if (this.editingJob && this.editingJob.descriptions) {
      const desc = this.editingJob.descriptions[index];
      if (desc && desc.id > 0) {
        this.deleteJobDescription(desc, index);
      } else {
        this.editingJob.descriptions.splice(index, 1);
      }
    }
  }

  saveJob(): void {
    if (!this.isAuthenticated || this.isSaving || !this.editingJob) return;

    this.isSaving = true;

    const updateJobDto: UpdateJobDto = {
      id: this.editingJob.jobId,
      tab: this.editingJob.tab,
      title: this.editingJob.title,
      startedDate: this.editingJob.startedDate,
      endedDate: this.editingJob.endedDate
    };

    const currentDescriptions = this.editingJob.descriptions ? [...this.editingJob.descriptions] : [];
    const descriptionRequests: Observable<any>[] = [];

    for (const desc of currentDescriptions) {
      if (desc.id > 0) {
        descriptionRequests.push(this.jobDescriptionService.update(desc));
      } else if (desc.description && desc.description.trim()) {
        descriptionRequests.push(
          this.jobDescriptionService.add({
            id: 0,
            jobId: updateJobDto.id,
            description: desc.description
          })
        );
      }
    }

    const jobUpdate$ = this.jobService.update(updateJobDto);
    const descriptionsUpdate$ = descriptionRequests.length > 0 ? forkJoin(descriptionRequests) : of([]);

    forkJoin({
      jobResult: jobUpdate$,
      descriptionsResult: descriptionsUpdate$
    })
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (results) => {
          const index = this.jobs.findIndex((j) => j.jobId === updateJobDto.id);
          if (index !== -1) {
            this.jobs[index] = {
              ...this.jobs[index],
              tab: updateJobDto.tab,
              title: updateJobDto.title,
              startedDate: new Date(updateJobDto.startedDate),
              endedDate: updateJobDto.endedDate ? new Date(updateJobDto.endedDate) : null as any,
              descriptions: currentDescriptions
            };
          }
          this.isEditMode = false;
          this.editingJob = null;
        },
        error: (error) => {
          console.error('Kaydetme sırasında hata oluştu:', error);
        }
      });
  }

  update(job: UpdateJobDto): void {
    if (this.isSaving) return;

    this.isSaving = true;
    this.jobService
      .update(job)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            const index = this.jobs.findIndex((j) => j.jobId === job.id);
            if (index !== -1) {
              this.jobs[index] = {
                ...this.jobs[index],
                tab: job.tab,
                title: job.title,
                startedDate: new Date(job.startedDate),
                endedDate: job.endedDate ? new Date(job.endedDate) : null as any
              };
            }
            this.isEditMode = false;
            this.editingJob = null;
          }
        },
        error: (error) => {
          console.error('İş bilgisi güncellenirken hata oluştu:', error);
        }
      });
  }

  updateJob(job: UpdateJobDto): void {
    this.update(job);
  }

  addJobDescription(jobDescription: JobDescription, targetJob?: Job): void {
    if (!this.isAuthenticated) return;

    this.jobDescriptionService
      .add(jobDescription)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const newDesc = response.data ?? jobDescription;
            const job = targetJob ?? this.jobs.find(j => j.jobId === jobDescription.jobId) ?? this.editingJob;
            if (job) {
              if (!job.descriptions) {
                job.descriptions = [];
              }
              const existingIndex = job.descriptions.findIndex(
                d => d === jobDescription || (d.id === 0 && d.description === jobDescription.description)
              );
              if (existingIndex !== -1) {
                job.descriptions[existingIndex] = newDesc;
              } else {
                job.descriptions.push(newDesc);
              }
            }
          }
        },
        error: (error) => {
          console.error('İş açıklaması eklenirken hata oluştu:', error);
        }
      });
  }

  updateJobDescription(jobDescription: JobDescription): void {
    if (!this.isAuthenticated) return;

    this.jobDescriptionService
      .update(jobDescription)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const updatedDesc = response.data ?? jobDescription;
            const job = this.jobs.find(j => j.jobId === jobDescription.jobId) ?? this.editingJob;
            if (job && job.descriptions) {
              const index = job.descriptions.findIndex(d => d.id === jobDescription.id);
              if (index !== -1) {
                job.descriptions[index] = updatedDesc;
              }
            }
          }
        },
        error: (error) => {
          console.error('İş açıklaması güncellenirken hata oluştu:', error);
        }
      });
  }

  deleteJobDescription(jobDescription: JobDescription, index?: number): void {
    if (!this.isAuthenticated) return;

    if (!jobDescription.id) {
      if (this.editingJob && this.editingJob.descriptions) {
        if (index !== undefined) {
          this.editingJob.descriptions.splice(index, 1);
        } else {
          const idx = this.editingJob.descriptions.indexOf(jobDescription);
          if (idx !== -1) this.editingJob.descriptions.splice(idx, 1);
        }
      }
      return;
    }

    this.jobDescriptionService
      .delete(jobDescription)
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (this.editingJob && this.editingJob.descriptions) {
              const idx = this.editingJob.descriptions.findIndex(d => d.id === jobDescription.id);
              if (idx !== -1) {
                this.editingJob.descriptions.splice(idx, 1);
              }
            }
            const job = this.jobs.find(j => j.jobId === jobDescription.jobId);
            if (job && job.descriptions) {
              const idx = job.descriptions.findIndex(d => d.id === jobDescription.id);
              if (idx !== -1) {
                job.descriptions.splice(idx, 1);
              }
            }
          }
        },
        error: (error) => {
          console.error('İş açıklaması silinirken hata oluştu:', error);
        }
      });
  }
}


