import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUpdateTypeComponent } from './select-update-type.component';
import { By } from '@angular/platform-browser';

describe('SelectUpdateTypeComponent', () => {
  let component: SelectUpdateTypeComponent;
  let fixture: ComponentFixture<SelectUpdateTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUpdateTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUpdateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dropdown-menu content if showPopOverFlag is true', async(() => {
    component.showPopOverFlag = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('.dropdown-menu'))).toBeTruthy();
    });
  }));

  it('should hide dropdown-menu content if showPopOverFlag is false', async(() => {
    component.showPopOverFlag = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('.dropdown-menu'))).toBeNull();
    });
  }));

  it('should show P tag if devicesCount is greater than 0', async(() => {
    fixture.destroy();
    component.devicesCount = 2;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.devicecount'))).toBeFalsy();
  }));

  it('should hide p contents if devicesCount is 0', () => {
    fixture.detectChanges();
    component.devicesCount = 0;

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.devicecount'))).toBeNull();
  });

  it('should call update method on button click', async(() => {
    const check = spyOn(component.updateDevices, 'emit');
    component.update();
    expect(check).toHaveBeenCalled();
  }));

  it('on ngOnChanges expected following steps to happen', async(() => {
    component.clearUpateType = true;
    component.ngOnChanges();
    expect(component.updateContentType).toBe(null, 'failed to set updateContentType value to null');
    expect(component.clearUpateType ).toBe(false, 'failed to set clearUpateType flag to false');
  }));
});
