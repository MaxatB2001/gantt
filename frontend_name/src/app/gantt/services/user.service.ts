import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { keycloakConfigInfo } from 'src/environments/environment';

interface User {
  id: string
  firstName: string
  lastName: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${keycloakConfigInfo.url}/admin/realms/test-realm/users`)
  }
}
