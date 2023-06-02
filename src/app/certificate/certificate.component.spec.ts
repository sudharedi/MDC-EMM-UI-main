import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateComponent } from './certificate.component';
import { certificateList } from 'src/data/mockData/certificate';

describe('CertificateComponent', () => {
  let component: CertificateComponent;
  let fixture: ComponentFixture<CertificateComponent>;
  const certificates = certificateList;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateComponent);
    component = fixture.componentInstance;
  });

  it('should create component', async(() => {
    fixture = TestBed.createComponent(CertificateComponent);
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should emit data on updatedConfigValues function call', async(() => {
    const data = certificateList;
    spyOn(component, 'onCertificateCancel').and.callThrough();
    component.onCertificateCancel(data);
    expect(component.onCertificateCancel).toHaveBeenCalled();
  }));

  it('should emit data on onCertificateUpdate function call', async(() => {
    const data = certificateList;
    spyOn(component, 'onCertificateUpdate').and.callThrough();
    component.onCertificateUpdate(data);
    expect(component.onCertificateUpdate).toHaveBeenCalled();
  }));
});
