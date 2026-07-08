import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getExpenses(page: number = 1, category: string = '', search: string = '', all: boolean = false): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    if (all) {
      params = params.set('all', 'true');
    }
    if (category) {
      params = params.set('category', category);
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getExpense(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createExpense(expense: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, expense);
  }

  updateExpense(id: number, expense: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
