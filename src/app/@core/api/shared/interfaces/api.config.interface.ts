import {HttpHeaders} from '@angular/common/http';

export interface IApiModuleConfig {
  baseUrl: string;
  headers: HttpHeaders | {
    [name: string]: string | string[];
  };
}
