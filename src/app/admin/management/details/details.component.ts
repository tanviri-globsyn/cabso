import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { DriverService } from '../../../service/driver.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { RidesService } from '../../../service/rides.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  user:any;
  rides:any;
  constructor(private service:DriverService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private rideService:RidesService,private location: Location) 
    { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.user = this.service.getInfo(params['id']).subscribe(res => {
        this.user = res;
      });
    });

    this.route.params.subscribe(params => {
      this.rides = this.rideService.getDriverRideCount(params['id']).subscribe(res => {
        this.rides = res;
      });
    });
  }
  
  goBack() {
    this.location.back(); 
  }
}


