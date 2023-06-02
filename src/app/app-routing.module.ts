import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewDeviceComponent } from './view-device/view-device.component';
import { SecurityComponent } from './security/security.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { ViewGroupComponent } from './devices/view-group/view-group.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { FirmwareListComponent } from './firmware/firmware-list/firmware-list.component';
import { LoginComponent } from './login/login.component';

import { AppPackageListComponent } from './app-package-list/app-package-list.component';
import { AlertsNotificationsComponent } from './alerts-notifications/alerts-notifications.component';
import { NonCompatibeDevicesComponent } from './non-compatibe-devices/non-compatibe-devices.component';
import { CompatibeDevicesComponent } from './compatibe-devices/compatibe-devices.component';
import { DashboardKpiComponent } from './dashboard-kpi/dashboard-kpi.component';
import { AuthGuardService } from '../app/auth/auth-guard.service';
import { LogsFaultsComponent } from './logs-faults/logs-faults.component'; 

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'devices', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'devices/:status', component: DashboardKpiComponent, canActivate: [AuthGuardService] },
  { path: 'deviceDetails/:macid', component: ViewDeviceComponent, canActivate: [AuthGuardService] },
  { path: 'groupDetails/:groupId', component: ViewGroupComponent, canActivate: [AuthGuardService] },
  { path: 'security/:id', component: SecurityComponent, canActivate: [AuthGuardService] },
  { path: 'auditlogs', component: AuditLogsComponent, canActivate: [AuthGuardService] },
  { path: 'footer', component: FooterComponent, canActivate: [AuthGuardService] },
  { path: 'createGroup', component: CreateGroupComponent, canActivate: [AuthGuardService] },
  { path: 'updateFirmware', component: FirmwareListComponent, canActivate: [AuthGuardService] },
  { path: 'apppackage', component: AppPackageListComponent, canActivate: [AuthGuardService] },
  { path: 'alertsnotifications', component: AlertsNotificationsComponent, canActivate: [AuthGuardService] },
  { path: 'apppackages', component: AppPackageListComponent, canActivate: [AuthGuardService] },
  { path: 'firmware', component: FirmwareListComponent, canActivate: [AuthGuardService] },
  { path: 'editGroup/:groupId', component: CreateGroupComponent, canActivate: [AuthGuardService] },
  { path: 'noncompatible', component: NonCompatibeDevicesComponent, canActivate: [AuthGuardService] },
  { path: 'compatible', component: CompatibeDevicesComponent, canActivate: [AuthGuardService] },
  { path: 'logsfaults/:id', component: LogsFaultsComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
