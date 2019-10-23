import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl + '/api';

  user: User;


  constructor(
      private httpClient: HttpClient,
  ) { }

  getUserInfo() {
    this.httpClient.get<User>(this.baseUrl + '/user-info')
        .pipe(catchError(this.handleError))
        .subscribe(
            user => {
              this.user = user;
            }
        );
  }

  handleError(error) {
    if (error.error instanceof ErrorEvent) {
    } else {
      if (error.status === 401) {
        window.location.href = '/saml/login';
      }
    }
    return throwError(error.message || error.error.message);
  }
}
