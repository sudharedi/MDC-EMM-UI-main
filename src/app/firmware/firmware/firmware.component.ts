import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../base-component.component';
@Component({
  selector: 'app-firmware',
  templateUrl: './firmware.component.html',
  styleUrls: ['./firmware.component.scss'],
})
export class FirmwareComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() firmwareData: any;
  @Input() updateType: any;
  @Output() fnReleaseNotes = new EventEmitter();
  @Output() fnUpdate = new EventEmitter();
  @Output() fnCancel = new EventEmitter();
  @Output() fnReInstall = new EventEmitter();
  totaldeviceCount;
  selectedFirmware;

  constructor() {
    super();
  }

  ngOnInit(): void {

  }

  /* release  notes open modal by emitting method to parent component */
  onSelectReleaseNotes(data) {
    this.fnReleaseNotes.emit(data);
  }

  /* Update : open modal by emitting method to parent component */
  onSelectFirmWare(data) {
    this.fnUpdate.emit(data);
  }
  onCancel(firmwareData) {
    this.fnCancel.emit(firmwareData);
  }
  onReInstall(firmwareData) {
    this.fnReInstall.emit(firmwareData);
  }
}
