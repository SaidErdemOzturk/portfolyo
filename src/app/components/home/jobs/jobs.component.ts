import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Job } from 'src/app/models/job';
import { JobService } from 'src/app/services/api/job.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  
  active = 0
  jobs:Job[]=[]

  isLoading = true;

  private subscription: Subscription;
  
  constructor(private jobService:JobService,
    private loadingService:LoadingService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );



    this.jobService.getJobs().subscribe(response=>{
      this.jobs=response.data
      for (let i = 0; i < this.jobs.length; i++) {
        this.datePipe.transform(this.jobs[i].startedDate,'dd.MM.yyyy')
      }
    })
  }

}
