// Edit Employee Component - TypeScript
// src/app/admin/employees/edit-employee.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { EmployeeService } from '../../_services/employee.service';
import { AccountService } from '../../_services/accounts.service';
import { DepartmentService } from '../../_services/department.service';
import { AlertService } from '@app/_services';

@Component({ 
  templateUrl: './edit-employee.component.html' 
})
export class EditEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  id!: string; // can be EMP001
  accounts: any[] = [];
  departments: any[] = [];
  statuses: string[] = ['Active', 'Inactive'];
  selectedAccount: any;

  loading = false;
  submitting = false;
  submitted = false;
  currentYearEnd!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private accountService: AccountService,
    private departmentService: DepartmentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // get route param
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.id) {
      console.error('Invalid employee ID in route:', this.id);
      this.alertService.error('Invalid employee ID');
      this.router.navigateByUrl('/admin/employees');
      return;
    }

    // build form
    this.employeeForm = this.fb.group({
      employeeId: [{ value: '', disabled: true }, Validators.required],
      accountId: ['', Validators.required],
      position: ['', Validators.required],
      departmentId: ['', Validators.required],
      hireDate: ['', Validators.required],
      status: ['', Validators.required]
    });

    const now = new Date();
    this.currentYearEnd = `${now.getFullYear()}-12-31`;

    // load data from backend
    this.loadData(this.id);
  }

  get f() { return this.employeeForm.controls; }

  private loadData(id: string) {
    this.loading = true;

    forkJoin({
      accounts: this.accountService.getAll(),
      departments: this.departmentService.getAll(),
      employee: this.employeeService.getById(id) // use string EMP001
    })
      .pipe(first())
      .subscribe({
        next: ({ accounts, departments, employee }) => {
          // this.accounts = accounts.filter(acc => acc.status === 'Active');
          this.accounts = accounts;
          this.departments = departments;

          // populate form
          this.employeeForm.patchValue({
            employeeId: employee.employeeId,
            accountId: employee.account?.id,
            position: employee.position,
            departmentId: employee.department?.id,
            hireDate: employee.hireDate,
            status: employee.status
          });

          this.selectedAccount = this.accounts.find(acc => acc.id === employee.account?.id);
          this.loading = false;
        },
        error: err => {
          console.error('LoadData error:', err);
          this.alertService.error('Failed to load employee data');
          this.loading = false;
        }
      });
  }

  onAccountChange(event: Event) {
    const accountId = (event.target as HTMLSelectElement).value;
    this.selectedAccount = this.accounts.find(acc => acc.id == Number(accountId));

    // if (this.selectedAccount || !this.employeeForm.get('email')?.value) { 
    //   this.alertService.warn('This account is already assigned to the employee.');
    // }

    if (this.selectedAccount && this.selectedAccount.status === 'Inactive') {
      this.alertService.warn('You selected an inactive account. This will not affect employee status.');
    }
    
  }

  onSubmit() {
  this.submitted = true;
  this.alertService.clear();

  if (this.employeeForm.invalid || !this.selectedAccount) {
    this.alertService.error('Please complete the form correctly.');
    return;
  }

  this.submitting = true;

  const employeeData = {
    ...this.employeeForm.getRawValue(),
    employeeId: this.employeeForm.get('employeeId')?.value,
    accountId: this.selectedAccount.id,   // make sure it's sent
    status: this.employeeForm.value.status // ensure status is included
  };

  console.log('Submitting update:', employeeData);

  this.employeeService.update(this.id, employeeData)
    .pipe(first())
    .subscribe({
      next: () => {
        this.alertService.success('Employee updated', { keepAfterRouteChange: true });
        this.router.navigateByUrl('/admin/employees');
      },
      error: error => {
        console.error(error);
        this.alertService.error(error);
        this.submitting = false;
      }
    });
}

}
