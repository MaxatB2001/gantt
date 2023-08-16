import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mainURL } from 'src/environments/environment';

interface Task {
      id: number,
    start_date: string,
    text: string,
    progress: number,
    duration: number,
}

interface Link {id:number, source:number, target:number, type:string}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(): Observable<{ganttTasks: Task[], links: Link[]}> {
    return this.http.get<{ganttTasks: Task[], links: Link[]}>(`${mainURL}/api/task-manager/gantt`)
  }

  createLink(link: Link) {
    return this.http.post(`${mainURL}/api/task-manager/link`, link)
  }
}
