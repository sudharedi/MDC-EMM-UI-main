import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  const eventSubject = new ReplaySubject<RouterEvent>(1);

  beforeEach(async(() => {
    const router = {
      navigate: jasmine.createSpy('navigate')
    };
    const currentRoute = { snapshot: { queryParams: () => ({}) } };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule, HttpClientModule, ToastrModule.forRoot({
        preventDuplicates: true
      })],
      declarations: [SidenavComponent]
    })
      .compileComponents();
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    component.isFirmware = false;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isFirmare flag to true when url is firmware', () => {
    eventSubject.next(new NavigationEnd(1, 'firmware', 'redirectUrl'));
    expect(component.isFirmware).toBe(false);
  });

  it('should set isFirmare flag to false when url is not firmware', () => {
    eventSubject.next(new NavigationEnd(1, 'auth', 'redirectUrl'));
    expect(component.isFirmware).toBe(false);
  });
  it('firmwareNavigation() should be called', () => {
    spyOn(component, 'firmwareNavigation').and.callThrough();
    component.firmwareNavigation();
    expect(component.firmwareNavigation).toHaveBeenCalled();
    expect(component.isFirmware).toBe(true);
  });

  it('appNavigation() should be called', () => {
    spyOn(component, 'appNavigation').and.callThrough();
    component.appNavigation();
    expect(component.appNavigation).toHaveBeenCalled();
  });
});
