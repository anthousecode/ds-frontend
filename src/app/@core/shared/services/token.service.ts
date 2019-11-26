import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  tokenUrlDev = 'http://ds-dev.rt-eu.ru/api/auth/login';
  tokenUrlSk = 'http://sk-ia.rt-eu.ru/api/auth/login';
  params = {
    username: '999-888-777 03',
    password: 'password'
  };

  constructor(private http: HttpClient) { }

  getTokenDev() {
    return this.http.post(this.tokenUrlDev, this.params);
  }

  getTokenSk() {
    return this.http.post(this.tokenUrlSk, this.params);
  }
}
