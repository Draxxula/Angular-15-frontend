// src/app/_services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

const baseUrl = `${environment.apiUrl}/employees`;

export interface Account {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  employeeId: string;
  position: string;
  hireDate: string;
  status: string;
  account?: Account;
  department?: Department;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
private baseUrl = 'https://websystemtest.vercel.app/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(baseUrl);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${baseUrl}/${id}`);
  }

  create(data: Employee): Observable<Employee> {
    return this.http.post<Employee>(baseUrl, data);
  }

  update(id: string, data: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${baseUrl}/${id}`, data);
  }

  transferDepartment(employeeId: string, departmentId: number): Observable<any> {
    return this.http.put(`${baseUrl}/${employeeId}/transfer`, { departmentId });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/${id}`);
  }
}
