import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = `${environment.apiUrl}/meetings`;

  constructor(private http: HttpClient) {}

  getMeetings(page: number = 1, status: string = '', search: string = '', all: boolean = false): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    if (all) {
      params = params.set('all', 'true');
    }
    if (status) {
      params = params.set('status', status);
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getMeeting(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createMeeting(meeting: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, meeting);
  }

  updateMeeting(id: number, meeting: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, meeting);
  }

  deleteMeeting(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
