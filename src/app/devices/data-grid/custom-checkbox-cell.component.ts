import { Component } from "@angular/core";

import { ICellRendererParams } from "@ag-grid-community/core";

@Component({
    selector: 'checkbox-cell-component',
    template: `<input type="checkbox" [checked]="device.checked" (click)="selectedRow($event.target.checked,device)">`,
})
export class CheckboxCellRenderer {
     device;
     selectedRow;
     isChecked;

    // gets called once before the renderer is used
    agInit(params: any): void {
        this.device = params?.data;
        this.selectedRow = params?.selectedRow;
        this.isChecked = params?.data?.checked;
    }

    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams) {
        this.device = params?.data;
    }
    
    checkboxClicked(isChecked) {
        this.device.checked = isChecked;
        this.selectedRow(isChecked, this.device)
    }
}