import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  user:any;
  url:any;
  constructor(
    private route: ActivatedRoute,
    private service:UserService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,private location: Location) 
    { this.toastr.setRootViewContainerRef(vcr);
     }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.route.params.subscribe(params => {
      this.user = this.service.getInfo(params['id']).subscribe(res => {
        this.user = res;
      });
    });
  }
  
  goBack() {
    this.location.back(); 
  }
}
