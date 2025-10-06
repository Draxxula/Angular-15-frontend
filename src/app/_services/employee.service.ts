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
  account?: Account;       // ✅ only one definition
  department?: Department; // ✅ only one definition
}

@Injectable({ providedIn: 'root' })

export class EmployeeService {
  private baseUrl = `http://localhost:4000/employees`; // your backend API

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  create(data: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, data);
  }

  update(id: string, data: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, data);
  }

  transferDepartment(employeeId: string, departmentId: number) {
  return this.http.put(`${this.baseUrl}/${employeeId}/transfer`, { departmentId });
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}