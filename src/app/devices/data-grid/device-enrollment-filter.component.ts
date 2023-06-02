import { Component, ViewChild } from '@angular/core';

import { AgFilterComponent } from '@ag-grid-community/angular';
import {
  IDoesFilterPassParams
} from '@ag-grid-community/core';

@Component({
  selector: 'device-enrollment-filter',
  styleUrls: ['./data-grid.component.scss'],
  templateUrl: './device-enrollment-filter.component.html',
})
export class DeviceEnrollmentFilter implements AgFilterComponent {
  params: any;
  filterText: string = '';
  selectedDateRangeHandle = null;
  sortDirection = 'ASC';
  fromDate = '';
  toDate = '';
  disableToDate = false;
  clearSelectedDates = null;

  agInit(params: any): void {
    this.params = params;
    this.selectedDateRangeHandle = this.params.selectedDateRange;
    this.sortDirection = this.params.sortDirection;
    this.fromDate = this.params.from;
    this.toDate = this.params.to;
    this.clearSelectedDates = this.params.clearSelectedDates;
    this.disableToDate = this.params.disableToDate;
  }

  applyFilter(){
    const fromDateSelected = new Date(this.fromDate).getTime();
    const toDateSelected = new Date(this.toDate).getTime();
    this.selectedDateRangeHandle(fromDateSelected, toDateSelected, this.sortDirection);
  }

  doesFilterPass(params: IDoesFilterPassParams) {
    // make sure each word passes separately, ie search for firstname, lastname
    return true;
  }

  isFilterActive(): boolean {
    return this.filterText != null && this.filterText !== '';
  }

  getModel() {
    return { value: this.filterText };
  }

  setModel(model: any) {
    this.filterText = model.value;
  }

  onInputChanged() {
  }

  clearFilter(){
    this.sortDirection = 'ASC';
    this.fromDate = '';
    this.toDate = '';
    this.clearSelectedDates();
  }
}