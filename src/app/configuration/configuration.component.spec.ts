import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationComponent } from './configuration.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { sampleConfigValues } from '../../data/mockData/configuration';

describe('ConfigurationComponent', () => {
  let component: ConfigurationComponent;
  let fixture: ComponentFixture<ConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationComponent],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit updatedConfigValues on onSubmit function call', async(() => {
    component.configValues = sampleConfigValues;
    spyOn(component.updatedConfigValues, 'emit').and.callThrough();
    component.onSubmit(sampleConfigValues);
    expect(component.updatedConfigValues.emit).toHaveBeenCalled();
  }));

  it('should change multiple values and emit cancleChanges when cancel function called', async(() => {
    spyOn(component.cancelChanges, 'emit').and.callThrough();
    component.cancel();
    fixture.detectChanges();
    expect(component.chargingSequence).toEqual([0, 0, 0, 0], 'Failed to replace charge sequence to [0,0,0,0]');
    expect(component.chargingSequenceRangeError).toBe(false, 'Failed to replace chargingSequenceRangeError false');
    expect(component.chargingSequenceDuplicates).toBe(false, 'Failed to replace chargingSequenceDuplicates false');
    expect(component.cancelChanges.emit).toHaveBeenCalled();
  }));

  it('Charging sequence validation - chargingSequenceRangeError should be true', async(() => {
    component.chargingSequence = [1, 2, 4, 5];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceRangeError).toBe(true, 'chargingSequenceRangeError expected to be true when chargingSequence[3] > 4');
    component.chargingSequence = [5, 2, 4, 1];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceRangeError).toBe(true, 'chargingSequenceRangeError expected to be true when chargingSequence[0] > 4');
    component.chargingSequence = [2, 5, 4, 1];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceRangeError).toBe(true, 'chargingSequenceRangeError expected to be true when chargingSequence[1] > 4');
    component.chargingSequence = [2, 0, 5, 1];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceRangeError).toBe(true, 'chargingSequenceRangeError expected to be true when chargingSequence[2] > 4');
  }));

  it('Charging sequence validation - chargingSequenceRangeError should be false', async(() => {
    component.chargingSequence = [1, 2, 3, 0];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceRangeError).toBe(false, 'chargingSequenceRangeError expected to be false in this case');
  }));

  it('Charging sequence validation - chargingSequenceDuplicates should be true', async(() => {
    component.chargingSequence = [0, 0, 0, 0];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceDuplicates).toBe(true, `chargingSequenceDuplicates expected to be true when all the
     chargeSequence values are 0\'s`);
  }));

  it('Charging sequence validation - chargingSequenceDuplicates should be true when countOne > 1', async(() => {
    component.chargingSequence = [0, 1, 0, 1];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceDuplicates).toBe(true, 'chargingSequenceDuplicates expected to be true when when countTwo is > 1');
  }));

  it('Charging sequence validation - chargingSequenceDuplicates should be true when countTwo > 1', async(() => {
    component.chargingSequence = [0, 2, 0, 2];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceDuplicates).toBe(true, 'chargingSequenceDuplicates expected to be true when countTwo is > 1');
  }));

  it('Charging sequence validation - chargingSequenceDuplicates should be true when countThree > 1', async(() => {
    component.chargingSequence = [0, 3, 0, 3];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceDuplicates).toBe(true, 'chargingSequenceDuplicates expected to be true when countThree is > 1');
  }));

  it('Charging sequence validation - chargingSequenceDuplicates should be true when countFour > 1', async(() => {
    component.chargingSequence = [0, 4, 0, 4];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceDuplicates).toBe(true, 'chargingSequenceDuplicates expected to be true when countFour is > 1');
  }));

  it('Charging sequence validation - chargingSequenceDuplicates should be false when requirements are matched', async(() => {
    component.chargingSequence = [0, 1, 2, 3];
    component.chargingSequenceValidation();
    expect(component.chargingSequenceDuplicates).toBe(false, 'chargingSequenceDuplicates expected to be false in this case');
  }));

  it('should call checkValidation', async(() => {
    component.configValues = sampleConfigValues;
    spyOn(component, 'checkValidation').and.callThrough();
    component.checkValidation(sampleConfigValues[0], 0);
    expect(component.checkValidation).toHaveBeenCalled();
  }));

  it('should call checkValidation - Branches', async(() => {
    component.configValues = sampleConfigValues;
    spyOn(component, 'checkValidation').and.callThrough();
    component.checkValidation(sampleConfigValues[1], 1);
    expect(component.checkValidation).toHaveBeenCalled();
  }));

  it('checkValidation - disable submmit button true', async(() => {
    component.configValues = sampleConfigValues;
    component.selectedConfigFields.push(sampleConfigValues[0]);
    spyOn(component, 'checkValidation').and.callThrough();
    component.checkValidation(sampleConfigValues[1], 1);
    expect(component.disableSubmit).toBe(true, 'Failing when selectedConfigFields.length > 0');
  }));

  it('checkValidation - disable submmit button false', async(() => {
    component.configValues = sampleConfigValues;
    spyOn(component, 'checkValidation').and.callThrough();
    component.checkValidation(sampleConfigValues, 0);
    expect(component.disableSubmit).toBe(false, 'Failing when selectedConfigFields.length < 0');
  }));

  it('should call selectedConfigFileds', async(() => {
    component.configValues = sampleConfigValues;
    spyOn(component, 'selectedConfigFileds').and.callThrough();
    component.selectedConfigFileds(Event, 0);
    expect(component.selectedConfigFileds).toHaveBeenCalled();
  }));
});
