import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { DataGridComponent } from './data-grid.component';
import { config, tableColumnHeaders, rowSelected, devicesListGrid as devicesList } from '../../../data/mockData/devicesAndGroups';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DeviceService } from '../device.service';
import { BaseService } from 'src/app/base-service.service';
import { By } from '@angular/platform-browser';

describe('DataGridComponent', () => {
  let component: DataGridComponent;
  let fixture: ComponentFixture<DataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        Ng2OrderModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot({
          preventDuplicates: true
        })],
      declarations: [DataGridComponent],
      providers: [DeviceService, BaseService ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    fixture.destroy();
    sessionStorage.setItem('socketObject', '[{"deviceSerial":"189ba5405bcc","message":"1605166291482","type":"lastseen","dispensers":[]}]');
    fixture.detectChanges();
  });

  it('should create compoent', async(() => {
    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  it('should display table result', async(() => {
    component.tableColumnHeaders = tableColumnHeaders;
    component.devicesList = devicesList;
    component.config = config;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.tableColumnHeaders).toBe(tableColumnHeaders);
    });
  }));

  it('should check whether all checkboxes are checked', async(() => {
    fixture.destroy();
    component.tableColumnHeaders = tableColumnHeaders;
    component.config = config;
    component.devicesList = devicesList;
    component.selectAll('event.target.checked');
    component.selectAllDevice = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.devicesList.length).toEqual(2);
    });
  }));

  it('should uncheck the main checkbox if  uncheck the row level checkbox', async(() => {
    component.devicesList = devicesList;
    component.tableColumnHeaders = tableColumnHeaders;
    component.config = config;
    component.rowSelected = rowSelected;
    component.devicesList[1].checked = false;
    fixture.detectChanges();
    component.selectedRow(false, component.rowSelected[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.selectAllDevice).toBeFalsy();
      fixture.whenStable().then(() => {
        expect(component.rowSelected.length).toBe(1);
      });
    });
  }));

  it('should hide fliter-dropdown initially', async(() => {
    component.showdropdown = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.nativeElement.querySelector('.filter-dropdown')).toBeNull();
    });
  }));

  it('should toggle showdropdown flag on filterDate function call', async(() => {
    component.devicesList = devicesList;
    spyOn(component, 'filterDate').and.callThrough();
    component.filterDate();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.showdropdown).toBe(true);
    });
  }));

  it('on deleteRow function call deleteDeviceFromGroup should emit data', async(() => {
    spyOn(component, 'deleteRow').and.callThrough();
    spyOn(component.deleteDeviceFromGroup, 'emit').and.callThrough();
    component.deleteRow();
    expect(component.deleteDeviceFromGroup.emit).toHaveBeenCalled();
  }));

  it('pagination should not be displayed when we dont have devicesList data', async(() => {
    component.devicesList = devicesList;
    component.showPagination = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('.pagination-section'))).toBeFalsy();
    });
  }));

  it('on pageChange function call pageChanged should emit data', async(() => {
    spyOn(component, 'pageChange').and.callThrough();
    spyOn(component.pageChanged, 'emit').and.callThrough();
    component.pageChange(2);
    expect(component.pageChanged.emit).toHaveBeenCalled();
  }));

  it('on selectedDateRange function  emit dates', async(() => {
    spyOn(component, 'selectedDateRange').and.callThrough();
    component.selectedDateRange();
    expect(component.selectedDateRange).toHaveBeenCalled();
  }));

  it('should call clearSelectedDates function  to clear dates', async(() => {
    spyOn(component, 'clearSelectedDates').and.callThrough();
    component.clearSelectedDates();
    expect(component.clearSelectedDates).toHaveBeenCalled();
  }));

  it('should call selectIndividualRowsToGroup function  to emit selected row data', async(() => {
    component.rowSelectedToGroup = rowSelected;
    spyOn(component, 'selectIndividualRowsToGroup').and.callThrough();
    component.selectIndividualRowsToGroup();
    expect(component.selectIndividualRowsToGroup).toHaveBeenCalled();
  }));

  it('should call sort function', async(() => {
    spyOn(component, 'sort').and.callThrough();
    component.sort('sampleId');
    expect(component.sort).toHaveBeenCalled();
    expect(component.key).toBe('sampleId', 'expected function param to be key');
  }));

  it('should call dateValidations function', async(() => {
    component.toDate = new Date();
    component.fromDate = new Date();
    spyOn(component, 'dateValidations').and.callThrough();
    component.dateValidations();
    expect(component.dateValidations).toHaveBeenCalled();
    expect(component.disableToDate).toBe(false);
  }));

  it('should call dateValidations function', async(() => {
    component.toDate = new Date().setFullYear(2020, 10, 3);
    component.fromDate = new Date().setFullYear(2020, 11, 3);
    spyOn(component, 'dateValidations').and.callThrough();
    component.dateValidations();
    expect(component.dateValidations).toHaveBeenCalled();
    expect(component.disableToDate).toBe(true);
  }));

  it('ngDoCheck', () => {
    spyOn(component, 'ngDoCheck').and.callThrough();
    component.ngDoCheck();
    fixture.detectChanges();
    expect(component.ngDoCheck).toHaveBeenCalled();
  });
});
