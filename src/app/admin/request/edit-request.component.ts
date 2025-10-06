// src/app/admin/request/edit-request.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { RequestService } from '@app/_services/request.service';
import { EmployeeService } from '@app/_services/employee.service';
import { AlertService } from '@app/_services';

@Component({
  templateUrl: './edit-request.component.html'
})
export class EditRequestComponent implements OnInit {
  requestForm!: FormGroup;
  id!: number;
  loading = false;
  submitting = false;
  employees: any[] = [];
  types = ['Equipment', 'Leave', 'Resources'];
  statuses = ['Pending', 'Approved', 'Rejected'];
  selectedEmployee: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private employeeService: EmployeeService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : 0;

    if (!this.id) {
      this.alertService.error('Invalid request ID');
      this.router.navigateByUrl('/admin/requests');
      return;
    }

    this.buildForm();
    this.loadData();
  }

  buildForm() {
    this.requestForm = this.fb.group({
      type: ['', Validators.required],
      employeeId: ['', Validators.required],
      items: this.fb.array([]),
      status: ['', Validators.required]
    });
  }

  // Getter for items form array
  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  addItem(item: any = { name: '', quantity: 1 }) {
    const itemGroup = this.fb.group({
      name: [item.name, Validators.required],
      quantity: [item.quantity, [Validators.required, Validators.min(1)]]
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  loadData() {
  this.loading = true;

  this.employeeService.getAll().pipe(first()).subscribe({
    next: (employees) => {
      this.employees = employees;
      console.log('Employees loaded:', employees);

      this.requestService.getById(this.id).pipe(first()).subscribe({
        next: (request) => {
          console.log('Request loaded:', request);
          
          // Clear existing items
          while (this.items.length !== 0) {
            this.items.removeAt(0);
          }

          // SIMPLE FIX: Use the employeeId directly since dropdown now uses employeeId
          this.requestForm.patchValue({
            type: request.type,
            employeeId: request.employeeId, // This matches the dropdown values now
            status: request.status
          });

          // Parse items
          let parsedItems: any[] = [];
          try {
            parsedItems = typeof request.items === 'string' 
              ? JSON.parse(request.items) 
              : request.items || [];
          } catch (e) {
            console.error('Error parsing items:', e);
            parsedItems = [];
          }

          // Add items to form array
          parsedItems.forEach((item: any) => {
            this.addItem(item);
          });

          console.log('Final form value:', this.requestForm.value);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading request:', err);
          this.alertService.error('Failed to load request');
          this.loading = false;
        }
      });
    },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.alertService.error('Failed to load employees');
        this.loading = false;
      }
    });
  }

  onEmployeeChange(event: Event) {
      const employeeId = (event.target as HTMLSelectElement).value;
      this.selectedEmployee = this.employees.find(emp => emp.employeeId === employeeId); 

      if (this.selectedEmployee && this.selectedEmployee.account?.status === 'Inactive') {
        this.alertService.warn('You selected an inactive employee. This will not affect request status.');
      }
      
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const selectedEmpId = this.requestForm.value.employeeId;
    const selectedEmp = this.employees.find(emp => emp.employeeId === selectedEmpId);
    if (selectedEmp && selectedEmp.account?.status === 'Inactive') {
      this.alertService.error('Cannot update request using an inactive employee.');
      return;
    }

    this.submitting = true;
    const updated = {
      ...this.requestForm.value,
      items: JSON.stringify(this.requestForm.value.items)
    };

    this.requestService.update(this.id, updated)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Request updated successfully', { keepAfterRouteChange: true });
          this.router.navigateByUrl('/admin/requests');
        },
        error: (error) => {
          this.alertService.error(error);
          this.submitting = false;
        }
      });
  }

}