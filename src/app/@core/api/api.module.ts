import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {BaseApiService} from './shared/base-api.service';
import {API_CONFIG} from './api.config';
import {IApiModuleConfig} from './shared/interfaces/api.config.interface';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    BaseApiService
  ]
})
export class ApiModule {
  static forRoot(apiConfig: IApiModuleConfig): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [
        {provide: API_CONFIG, useValue: apiConfig},
      ]
    };
  }
}
