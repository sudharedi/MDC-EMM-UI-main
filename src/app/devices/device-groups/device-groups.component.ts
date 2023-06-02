import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DeviceService } from '../device.service';
import { Router } from '@angular/router';
import { DeviceGroups } from '../../shared/models/deviceGroups.model';
import { BaseComponent } from '../../base-component.component';

@Component({
  selector: 'app-device-groups',
  templateUrl: './device-groups.component.html',
  styleUrls: ['./device-groups.component.scss']
})
export class DeviceGroupsComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() deviceGroups: DeviceGroups[];
  @Input() configGroup: any;
  @Input() noOfElementsGroup: number;
  @Output() groupPageChanged: EventEmitter<any> = new EventEmitter();
  @Output() selectedGroups: EventEmitter<any> = new EventEmitter();
  @Input() clearGroupsRowSelected: boolean;
  @Output() changeGroupBooleanValue: EventEmitter<any> = new EventEmitter();


  rowSelected = [];
  selectAllDevices;

  constructor(private deviceService: DeviceService, private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  groupPageChange(groupPageNumber: number) {
    this.groupPageChanged.emit(groupPageNumber);
    this.rowSelected = [];
    this.selectAllDevices = false;
    this.selectedGroups.emit(this.rowSelected);
  }

  selectedRow(checked, group) {
    if (checked) {
      this.rowSelected.push(group);
    } else {
      this.rowSelected.forEach((value, key) => {
        if (group === value) {
          this.rowSelected.splice(key, 1);
        }
      });
    }

    this.checkDuplicates(this.rowSelected);
  }

  selectAll(event) {
    if (event.target.checked) {
      this.deviceGroups.forEach(group => {
        group.checked = true;
        this.rowSelected.push(group);
      });
    } else {
      this.rowSelected = [];
      this.deviceGroups.forEach(group => {
        group.checked = false;
      });
    }
    this.checkDuplicates(this.rowSelected);

  }

  checkDuplicates(SelectedGroupsList) {
    this.rowSelected = [...new Set(SelectedGroupsList)];
    this.selectedGroups.emit(this.rowSelected);

    if (this.rowSelected.length === 0 || this.rowSelected.length < 10) {
      this.selectAllDevices = false;
    }

    if (this.rowSelected.length === this.deviceGroups.length ) {
      this.selectAllDevices = true;
    } else {
      this.selectAllDevices = false;
    }
  }

  viewGroupDetails(group) {
    this.router.navigate(['/groupDetails', group.id]);
  }

  ngOnChanges() {
    if (this.clearGroupsRowSelected) {
      this.rowSelected = [];
      this.selectAllDevices = false;
    }
    const parentThis = this;
    setTimeout(function(){ parentThis.changeGroupBooleanValue.emit(); }, 10); // making async call to avaoid race condition.
  }

}
