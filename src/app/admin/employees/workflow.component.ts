// src/app/admin/employees/workflow.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from '@app/_services/workflow.service';
import { EmployeeService } from '@app/_services';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html'
})
export class WorkflowComponent implements OnInit {
    workFlowForm!: FormGroup
    employeeId!: string;
    workflows: any[] = [];
    employee: any;
    loading = false;    

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private workflowService: WorkflowService,
        private employeeService: EmployeeService
    ) {}

    ngOnInit() {
        this.employeeId = this.route.snapshot.paramMap.get('employeeId')!;
        this.loadWorkflows();
        
        // Fetch employee
        this.employeeService.getById(this.employeeId).subscribe(emp => {
            this.employee = emp;
        });
    }

    loadWorkflows() {
        this.loading = true;
        this.workflowService.getByEmployee(this.employeeId).subscribe({
            next: (data: any) => {
                this.workflows = data;
                this.loading = false;
                console.log('Workflows loaded:', data); // Debug log
            },
            error: (err: any) => {
                console.error('Error loading workflows:', err);
                this.loading = false;
            }
        });
    }

    updateStatus(workflowId: number, status: string) {
        this.workflowService.updateStatus(workflowId, status).subscribe({
            next: () => this.loadWorkflows(),
            error: (err: any) => console.error('Error updating status:', err)
        });
    }

    // Helper method to check if string is JSON
    isJsonString(str: string): boolean {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Helper method to parse items
    parseItems(itemsString: string): any[] {
        try {
            return JSON.parse(itemsString);
        } catch (e) {
            return [{ name: itemsString, quantity: 1 }];
        }
    }
}