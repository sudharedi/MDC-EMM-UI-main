import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogsService } from '../shared/models/services/auditLogs.service';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { auditLogList } from '../../data/mockData/auditLog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('AuditLogsComponent', () => {
  let component: AuditLogsComponent;
  let fixture: ComponentFixture<AuditLogsComponent>;
  let auditLogsService: AuditLogsService;
  const auditMock = {
    content: [
      {
        action: 'Group Name Updated',
        alias: 'Device-45',
        createdBy: 'Sandeep Adapa',
        createdDate: '2020-10-28T13:34:00.201+0000',
        deviceSerial: '0EA8FA473A30',
        group: 'groupnameDeleted',
        id: '47d595f9-8b31-4cb8-97b1-8e88ce33e1b0',
        lastModifiedBy: 'Sandeep Adapa',
        lastModifiedDate: '2020-10-28T13:34:00.201+0000'
      },
      {
        action: 'Firmware Updated',
        alias: 'sourav-devices',
        createdBy: 'Sandeep Adapa',
        createdDate: '2020-10-28T12:24:23.115+0000',
        deviceSerial: '189ba5405bcc',
        group: 'QA_devices',
        id: 'a000bb6a-8900-4f3f-8e4d-3f26bb0637ac',
        lastModifiedBy: 'Sandeep Adapa',
        lastModifiedDate: '2020-10-28T12:24:23.115+0000',
      },
      {
        action: 'Group Name Updated',
        alias: 'Device-70',
        createdBy: 'Sandeep Adapa',
        createdDate: '2020-10-28T13:27:43.199+0000',
        deviceSerial: '991FDD81FCD0',
        group: 'auditTest',
        id: 'df1db022-b489-469d-8042-8ef1986865ad',
        lastModifiedBy: 'Sandeep Adapa',
        lastModifiedDate: '2020-10-28T13:27:43.199+0000',
      }
    ],
    empty: false,
    first: true,
    last: false,
    number: 0,
    numberOfElements: 10,
    pageable: {
      offset: 0,
      pageNumber: 0,
      pageSize: 10,
      paged: true,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true
      },
      unpaged: false
    },
    size: 10,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    totalElements: 53,
    totalPages: 6
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditLogsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        })
      ],
      providers: [
        {
          provide: AuditLogsService, useValue: {
            fectAll: (params) => of(auditMock),
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditLogsComponent);
    component = fixture.componentInstance;
    auditLogsService = TestBed.inject(AuditLogsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should get the list of audit', () => {
    component.getAuditLogsList();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('sortDirection', 'ASC');
    expect(component.getAuditLogsList()).toEqual(auditLogList[1]);
    // expect(component.noOfElements).toBe(1, 'failed to set configGroup.currentPage with 1');
    expect(component.configAuditLog.currentPage).toBe(1, 'failed to set configGroup.currentPage with 1');
  });


  it('should call pageChanged()', async(() => {
    spyOn(component, 'pageChanged').and.callThrough();
    spyOn(component, 'getAuditLogsList');
    component.pageChanged(1);
    fixture.detectChanges();
    expect(component.pageChanged).toHaveBeenCalled();
    expect(component.selectedPageNum).toBe(0, 'failed to assign value 0 to selectedPageNum');
    expect(component.configAuditLog.currentPage).toBe(1, 'failed to set configGroup.currentPage with 1');
  }));
});
