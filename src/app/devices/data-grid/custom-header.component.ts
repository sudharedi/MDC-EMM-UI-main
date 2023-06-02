import { Component, ElementRef, ViewChild } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular'

@Component({
    selector: 'app-custom-header',
    template: `<input type="checkbox"  id="checkAll" name="selectAll" (click)="selectAll($event)" [checked]="selectAllDevice.allSelected">`,
    
})
export class CustomHeaderCheckbox implements IHeaderAngularComp {
     params: any;
     selectAllDevice;
     selectAll;

    agInit(params: any): void {
        this.params = params;
        this.selectAll = params.selectAll;
        this.selectAllDevice = params.selectAllDevice;
    }

    refresh(params: any): boolean {
        this.selectAllDevice = params.selectAllDevice;
        return true;
    }
}