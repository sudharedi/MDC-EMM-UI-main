import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {


    /*data will come from the parent component */
    @Input() certificateData;
    @Input() certificateUpdateRequest;

    @Output() fnCancel = new EventEmitter();
    @Output() fnUpdate = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onCertificateCancel(data: any) {
    this.fnCancel.emit(data);
  }


  onCertificateUpdate(data: any) {
    this.fnUpdate.emit(data);
  }

}
