import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Job } from 'src/app/models/job';
import { UpdateJobDto } from 'src/app/models/updateJobDto';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { LoadingService } from '../loading/loading.service';
import { SingleResponseModel } from 'src/app/models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private httpClient: HttpClient,
    private loadingService: LoadingService
  ) { }

  apiUrl = "https://api.saiderdemozturk.com/api/Job/"

  getJobs(): Observable<ListResponseModel<Job>> {
    this.loadingService.show()
    return this.httpClient.get<ListResponseModel<Job>>(this.apiUrl + "getjobwithdescriptiondto").pipe(finalize(() => this.loadingService.hide()));
  }

  update(job: UpdateJobDto): Observable<SingleResponseModel<Job>> {
    return this.httpClient.post<SingleResponseModel<Job>>(this.apiUrl + "update", job);
  }
}
