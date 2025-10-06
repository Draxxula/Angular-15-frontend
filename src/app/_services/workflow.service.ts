// src/app/_services/workflow.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

const baseUrl = `${environment.apiUrl}/workflows`;

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  constructor(private http: HttpClient) {}

  // Get all workflows by employee ID
  getByEmployee(employeeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/employee/${employeeId}`);
  }

  // Update workflow status (e.g., Approved / Rejected)
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, { 
      status,
      syncRequest: true // Ensure request status is synced
    });
  }

  // Optional: get all workflows (e.g., for admin view)
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(baseUrl);
  }
}
