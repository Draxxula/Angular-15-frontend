// src/app/_services/workflow.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private baseUrl = `http://localhost:4000/workflows`; // ✅ fixed to workflows

  constructor(private http: HttpClient) {}

  // Get all workflows by employee ID
  getByEmployee(employeeId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  // Update workflow status (e.g., Approved / Rejected)
  updateStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}/${id}`, { 
      status,
      syncRequest: true // Ensure request status is synced
    });
  }

  // Optional: get all workflows (e.g., for admin view)
  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }
}
