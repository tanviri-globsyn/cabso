import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { RidesService } from '../../../service/rides.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../../../service/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rides-details',
  templateUrl: './rides-details.component.html',
  styleUrls: ['./rides-details.component.css']
})
export class RidesDetailsComponent implements OnInit {

  rides:any;
  user:any;
  constructor(private service:RidesService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private authService:AuthService, private location: Location) 
    { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.rides = this.service.getInfo(params['id']).subscribe(res => {
        this.rides = res;
      });
    });
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
   });

  }
  goBack() {
    this.location.back(); 
  }

}
