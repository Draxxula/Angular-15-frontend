import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { AddEmployeeComponent } from './add-employee.component';
import { EditEmployeeComponent } from './edit-employee.component';
import { TransferEmployeeComponent } from './transfer-employee.component';
import { WorkflowComponent } from './workflow.component';

const routes: Routes = [
    { path: '', component: EmployeeComponent },
    { path: 'create', component: AddEmployeeComponent },
    { path: 'edit/:id', component: EditEmployeeComponent },
    { path: 'transfer/:id', component: TransferEmployeeComponent },
    { path: 'workflows/:employeeId', component: WorkflowComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmployeeRoutingModule {}
