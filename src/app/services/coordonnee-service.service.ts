import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http' 
import { mapDataInterface } from '../DatasInterface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordonneeServiceService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  async getlocation(){
    const url =  'assets/data-address.json';
    const request = this._http.get<mapDataInterface[]>(url);
    const response = await firstValueFrom(request);
    return response;
  }
}
