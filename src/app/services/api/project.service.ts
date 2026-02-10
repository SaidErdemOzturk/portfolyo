import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { ProjectDto } from 'src/app/models/projectDto';
import { ProjectWithTech } from 'src/app/models/projectWithTech';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient:HttpClient,
    private loadingService:LoadingService
  ) { }

  //apiUrl="http://localhost:5019/api/Project/"
  apiUrl="http://api.saiderdemozturk.com/api/Project/"

  getProjectsDto():Observable<ListResponseModel<ProjectDto>>{
    this.loadingService.show()
    return this.httpClient.get<ListResponseModel<ProjectDto>>(this.apiUrl+"getallwithdto").pipe( finalize(() => this.loadingService.hide()));
  }
  getMoreProjectsDto():Observable<ListResponseModel<ProjectWithTech>>{
    this.loadingService.show()
    return this.httpClient.get<ListResponseModel<ProjectWithTech>>(this.apiUrl+"getmoreproject").pipe(finalize(() => this.loadingService.hide()));
  }
}
