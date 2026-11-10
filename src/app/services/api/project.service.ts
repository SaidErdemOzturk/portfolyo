import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CreatedProjectDto } from 'src/app/models/createdProjectDto';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { Project } from 'src/app/models/project';
import { ProjectDto } from 'src/app/models/projectDto';
import { ProjectWithTech } from 'src/app/models/projectWithTech';
import { ResponseModel } from 'src/app/models/responseModel';
import { SingleResponseModel } from 'src/app/models/singleResponseModel';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private editProjectSubject = new Subject<Project>();
  editProject$ = this.editProjectSubject.asObservable();

  private projectsUpdatedSubject = new Subject<void>();
  projectsUpdated$ = this.projectsUpdatedSubject.asObservable();

  constructor(private httpClient: HttpClient,
    private loadingService: LoadingService
  ) { }

  apiUrl = "https://api.saiderdemozturk.com/api/Project/"

  getProjectsDto(): Observable<ListResponseModel<ProjectDto>> {
    this.loadingService.show()
    return this.httpClient.get<ListResponseModel<ProjectDto>>(this.apiUrl + "getallwithdto").pipe(finalize(() => this.loadingService.hide()));
  }

  getMoreProjectsDto(): Observable<ListResponseModel<ProjectWithTech>> {
    this.loadingService.show()
    return this.httpClient.get<ListResponseModel<ProjectWithTech>>(this.apiUrl + "getmoreproject").pipe(finalize(() => this.loadingService.hide()));
  }

  add(project: Project): Observable<SingleResponseModel<CreatedProjectDto>> {
    return this.httpClient.post<SingleResponseModel<CreatedProjectDto>>(this.apiUrl + "add", project);
  }

  update(project: any): Observable<ResponseModel> {
    this.loadingService.show();

    console.log("project", project)

    const payload = {
      id: project.id,
      title: project?.title ?? '',
      description: project?.description ?? '',
      ghLink: project?.ghLink ?? '',
      demoLink: project?.demoLink ?? ''
    };

    return this.httpClient.post<ResponseModel>(this.apiUrl + "update", payload).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  delete(project: any): Observable<ResponseModel> {
    this.loadingService.show();
    const resolvedId = typeof project === 'number'
      ? project
      : (project?.id ?? project?.projectId ?? project?.Id ?? project?.ProjectId);

    const payload = {
      id: resolvedId,
      title: project?.title ?? '',
      description: project?.description ?? '',
      ghLink: project?.ghLink ?? '',
      demoLink: project?.demoLink ?? ''
    };

    return this.httpClient.post<ResponseModel>(this.apiUrl + "delete", payload).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  setEditProject(project: Project): void {
    this.editProjectSubject.next(project);
  }

  notifyProjectsUpdated(): void {
    this.projectsUpdatedSubject.next();
  }
}
