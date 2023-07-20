import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl
  router: any;

  constructor(private http: HttpClient) { }

  postRequest(endpoint: string, data:any) : Observable<any> {    
    return this.http.post(this.baseUrl + endpoint , data)
  }

  getRequest(endpoint: string) : Observable<any> {
    return this.http.get(this.baseUrl + endpoint)
  }
  
  deleteRequest(endpoint: string) : Observable<any> {
    return this.http.delete(this.baseUrl + endpoint)
  }
}
