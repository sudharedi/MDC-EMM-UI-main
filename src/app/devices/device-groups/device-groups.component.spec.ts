import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DeviceGroupsComponent } from './device-groups.component';
import { By } from '@angular/platform-browser';
import {
  config, tableColumnHeaders, rowSelected,
  devicesListGrid as devicesList, deviceGroups, GroupsSelected
} from '../../../data/mockData/devicesAndGroups';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { DeviceService } from '../device.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import {NgxPaginationModule} from 'ngx-pagination';

describe('DeviceGroupsComponent', () => {
  let component: DeviceGroupsComponent;
  let fixture: ComponentFixture<DeviceGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceGroupsComponent ],
      imports: [HttpClientTestingModule,
        HttpClientModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
        RouterTestingModule,
        NgxPaginationModule
      ],
      providers : [ DeviceService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceGroupsComponent);
    component = fixture.componentInstance;
    fixture.destroy();
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(DeviceGroupsComponent);
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should uncheck the main checkbox if  uncheck the row level checkbox', async(() => {
    component.deviceGroups = deviceGroups;
    component.rowSelected = GroupsSelected;
    fixture.detectChanges();
    component.selectedRow(false, component.rowSelected[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.selectAllDevices).toBeFalsy();
      fixture.whenStable().then(() => {
        expect(component.rowSelected.length).toBe(1);
      });
    });
  }));

  it('should check whether all checkboxes are checked', async(() => {
    fixture.destroy();
    component.deviceGroups = deviceGroups;
    component.rowSelected = GroupsSelected;
    fixture.detectChanges();
    const checkbox = fixture.debugElement.nativeElement.querySelector('input#checkAll');
    checkbox.click('event.target.checked');
    component.selectedRow(true, component.rowSelected[0]);
    component.selectedRow(true, component.rowSelected[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.rowSelected.length).toEqual(component.deviceGroups.length);
    });
  }));

  it('Number of elements should match as per the given input array', () => {
    component.noOfElementsGroup = deviceGroups.length;
    component.ngOnInit();
    expect(component.noOfElementsGroup).toBe(2);
  });

  it('should call viewGroupDetails on view button click', async(() => {
    const mySpy = spyOn(component, 'viewGroupDetails');
    component.viewGroupDetails(deviceGroups[0]);
    fixture.detectChanges();
    expect(mySpy).toHaveBeenCalled();
  }));

  it('groupPageChange', () => {
    spyOn(component, 'groupPageChange').and.callThrough();
    component.groupPageChange(5);
    fixture.detectChanges();
    expect(component.groupPageChange).toHaveBeenCalled();
    expect(component.rowSelected).toEqual([], 'failed to set row selected with empty array');
    expect(component.selectAllDevices).toBe(false, 'failed to selectAllDevices to false');
  });

  it('On ngOnChanges() method expect function to be called', () => {
    component.clearGroupsRowSelected = true;
    spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(component.ngOnChanges).toHaveBeenCalled();
    expect(component.rowSelected).toEqual([]);
    expect(component.selectAllDevices).toBe(false);
  });

  it('On ngOnChanges() method expect function to be called', () => {
    component.clearGroupsRowSelected = false;
    spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(component.ngOnChanges).toHaveBeenCalled();
  });
});
