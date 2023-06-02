import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../shared/models/services/loader.service';
import { BaseComponent } from '../base-component.component';

@Component({
  selector: 'app-loader-interceptor',
  templateUrl: './loader-interceptor.component.html',
  styleUrls: ['./loader-interceptor.component.scss']
})
export class LoaderInterceptorComponent extends BaseComponent implements OnInit {
  loading: boolean;

  constructor(private loaderService: LoaderService) {
    super();

    const loaderSub = this.loaderService.isLoading.subscribe((res) => {
      this.loading = res;
    });
    this.subscribers.push(loaderSub);
  }

  ngOnInit(): void {
  }

}
