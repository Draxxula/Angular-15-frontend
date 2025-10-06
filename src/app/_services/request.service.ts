// src/app/_services/request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.service';
import { environment } from '@environments/environment';

const baseUrl = `${environment.apiUrl}/requests`;

export interface Request {
  id: number;
  type: 'Equipment' | 'Leave';
  items: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  employeeId: number;
  employee?: Employee;
  parsedItems?: { name: string; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Request[]> {
    return this.http.get<Request[]>(baseUrl);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(`${baseUrl}/${id}`);
  }

  create(data: Request): Observable<Request> {
    return this.http.post<Request>(baseUrl, data);
  }

  update(id: number, data: Request): Observable<Request> {
    return this.http.put<Request>(`${baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/${id}`);
  }
}
