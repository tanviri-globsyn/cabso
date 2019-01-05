import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { RidesService } from '../../../service/rides.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css']
})
export class RidesComponent implements OnInit {
  rides:any;
  status:any;
  filter:any;
  user:any;
  constructor(private service:RidesService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private authService:AuthService) 
    {this.toastr.setRootViewContainerRef(vcr);
    
      this.status = [
        "cancelled","completed","onride","ontheway","scheduled","accepted","ridenotaccepted"
      ]
    }

  ngOnInit() {
    this.getPage();
  }
  getPage() {
    this.service.getPage().subscribe(res => {
      this.rides = res;
    });

    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
   });
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
