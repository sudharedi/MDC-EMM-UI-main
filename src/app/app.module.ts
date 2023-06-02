import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DevicesComponent } from './devices/devices.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewDeviceComponent } from './view-device/view-device.component';
import { DataGridComponent } from './devices/data-grid/data-grid.component';
import { DeviceGroupsComponent } from './devices/device-groups/device-groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SecurityComponent } from './security/security.component';
import { LogsFaultsComponent } from './logs-faults/logs-faults.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { ViewGroupComponent } from './devices/view-group/view-group.component';
import { AppPackageComponent } from './app-package/app-package.component';
import { FirmwareListComponent } from './firmware/firmware-list/firmware-list.component';
import { FirmwareComponent } from './firmware/firmware/firmware.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertsNotificationsComponent } from './alerts-notifications/alerts-notifications.component';
import { AppPackageListComponent } from './app-package-list/app-package-list.component';
import { SelectUpdateTypeComponent } from './select-update-type/select-update-type.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { NonCompatibeDevicesComponent } from './non-compatibe-devices/non-compatibe-devices.component';
import { CompatibeDevicesComponent } from './compatibe-devices/compatibe-devices.component';
import { CertificateComponent } from './certificate/certificate.component';

import { LoaderInterceptorService } from './shared/models/services/loader-interceptor.service';
import { LoaderService } from './shared/models/services/loader.service';
import { LoaderInterceptorComponent } from './loader-interceptor/loader-interceptor.component';
import { DashboardKpiComponent } from './dashboard-kpi/dashboard-kpi.component';
import { LoginComponent } from './login/login.component';
// Auth services
import { AuthService } from './auth/auth.service';
import { CognitoService } from './auth/cognito.service';
import { LoginService } from './login/login.service';
import { ErrorInterceptor } from './auth/error.interceptor';
import { AuthenticationInterceptor } from './auth/authentication.interceptor';
import { TitleCasePipe } from '@angular/common';
import { AuthGuardService } from '../app/auth/auth-guard.service';
// import { TimerService } from './shared/models/services/timer.service';

import { ApiInterceptor } from './shared/models/services/api.interceptor';

import { AgGridModule } from 'ag-grid-angular';
import {DeviceEnrollmentFilter} from './devices/data-grid/device-enrollment-filter.component';
import { CustomHeaderCheckbox } from './devices/data-grid/custom-header.component';
import { CheckboxCellRenderer } from './devices/data-grid/custom-checkbox-cell.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomHeaderCheckbox,
    CheckboxCellRenderer,
    DevicesComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    DashboardComponent,
    ViewDeviceComponent,
    DataGridComponent,
    DeviceGroupsComponent,
    SecurityComponent,
    LogsFaultsComponent,
    AuditLogsComponent,
    ViewGroupComponent,
    CreateGroupComponent,
    AppPackageComponent,
    FirmwareListComponent,
    FirmwareComponent,
    AppPackageListComponent,
    AlertsNotificationsComponent,
    SelectUpdateTypeComponent,
    ConfigurationComponent,
    NonCompatibeDevicesComponent,
    CompatibeDevicesComponent,
    CertificateComponent,
    LoaderInterceptorComponent,
    DashboardKpiComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([DeviceEnrollmentFilter, CustomHeaderCheckbox, CheckboxCellRenderer]),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    MarkdownModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    LoaderService,
    AuthService,
    CognitoService,
    LoginService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    TitleCasePipe,
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    // TimerService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
