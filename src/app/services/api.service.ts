import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  http = inject(HttpClient);
  // ==================== Solicitud POST ==================== //
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }

  // ==================== Solicitud GET ==================== //
  getData(endpoint: string, params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`, { params });
  }

  // ==================== Solicitud PUT ==================== //
  updateData(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data);
  }

  // ==================== Solicitud DELETE ==================== //
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`);
  }


}
