import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-package',
  templateUrl: './app-package.component.html',
  styleUrls: ['./app-package.component.scss']
})
export class AppPackageComponent implements OnInit {


  /*data will come from the parent component */
  @Input() packagesData;

  /* tabType : can  be Default Packages, User Packages */
  @Input() tabType;

  /* page type is required to find the whether it has parent element or not */
  @Input() pageType; // { pageType : "globalAppPackage"}

  @Output() fnUpdate = new EventEmitter();
  @Output() fnUnInstall = new EventEmitter();
  @Output() fnReleaseNotes = new EventEmitter();
  @Output() fnReInstall = new EventEmitter();
  @Output() fnCancel = new EventEmitter();


  versionColumn = false;
  sizeColumn = false;
  packageColumn = true;
  userRoles;




  constructor() {

  }

  ngOnInit(): void {
    if (this.pageType === 'globalAppPackage' || this.tabType === 'Default Packages') {
      this.versionColumn = true;
      this.sizeColumn = true;
      this.packageColumn = false;
    } else if (this.pageType === 'userAppPackage' || this.tabType === 'userpackages') {
      this.versionColumn = false;
      this.sizeColumn = true;
      this.packageColumn = true;
    }
    this.showCorrespodningIcon();
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
  }
  showCorrespodningIcon() {
    if (this.packagesData.status === undefined || this.packagesData.status === '') {
      this.packagesData.status = 'NA';
    }
  }

  onSelectReleaseNotes(data) {
    this.fnReleaseNotes.emit(data);
  }

  onSelectApp(data) {
    this.fnUpdate.emit(data);
  }

  onUnInstallApp(packagedata) {
    this.fnUnInstall.emit(packagedata);
  }
  onReInstall(packageData) {
    this.fnReInstall.emit(packageData);
  }
  onCancel(packageData) {
    this.fnCancel.emit(packageData);
  }
}
