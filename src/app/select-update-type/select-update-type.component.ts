import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { BaseComponent } from '../base-component.component';

@Component({
  selector: 'app-select-update-type',
  templateUrl: './select-update-type.component.html',
  styleUrls: ['./select-update-type.component.scss'],
})
export class SelectUpdateTypeComponent extends BaseComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() showPopOverFlag: boolean;
  @Input() updateType: number;
  @Input() devicesCount: number;
  @Input() clearUpateType: boolean;

  @Output() updateDevices: EventEmitter<any> = new EventEmitter();
  updateContentType: number;
  userRoles;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
   }

  update() {
    const updateObj = {
      updateType: Number(this.updateType),
      updateContentType: Number(this.updateContentType)
    };
    this.updateDevices.emit(updateObj);
  }

  ngOnChanges() {
    if (this.clearUpateType) {
      this.updateContentType = null;
      this.clearUpateType = false;
    }
  }

}
