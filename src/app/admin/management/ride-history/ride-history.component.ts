import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { RidesService } from '../../../service/rides.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router,ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DriverService } from '../../../service/driver.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent implements OnInit {
  rides:any;
  status:any;
  filter:any;
  driver:any;
  constructor(private service:RidesService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute, private serviceDriver:DriverService,private location: Location) 
    {this.toastr.setRootViewContainerRef(vcr);
    
      this.status = [
        "cancelled","completed","onride","ontheway","scheduled","accepted","ridenotaccepted",
      ]
    }

  ngOnInit() {
    this.getPage();
  }
  getPage() {
    this.route.params.subscribe(params => {
      this.rides = this.service.getDriverRide(params['id']).subscribe(res => {
        this.rides = res;
      });
    });

    this.route.params.subscribe(params => {
      this.driver = this.serviceDriver.getInfo(params['id']).subscribe(res => {
        this.driver = res;
      });
    });
  }

  goBack() {
    this.location.back(); 
  }
  onChange(Value) {
   if(Value==="undefined")
   {
    this.getPage();
    this.filter="";
   }
  
  }
  key: string = '_id'; //set default

  reverse: boolean = false;

  sort(key){

    this.key = key;

    this.reverse = !this.reverse;
   
  
  }
  p: number = 1;


}