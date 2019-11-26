import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule, BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiModule} from './api/api.module';
import {environment} from '../../environments/environment';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    ApiModule.forRoot(
      {
        baseUrl: environment.apiUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ),
  ],
  providers: [
  ]
})
export class CoreModule { }
