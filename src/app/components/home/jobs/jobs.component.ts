import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/models/job';
import { JobDescription } from 'src/app/models/jobDescription';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { JobService } from 'src/app/services/api/job.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  
  active = 0
  jobs:Job[]=[]
  
  constructor(private jobService:JobService
  ) { }

  ngOnInit(): void {
    this.jobService.getJobs().subscribe(response=>{
      this.jobs=response.data
      console.log("jobjobjob",response.data)

    })
  }

}
