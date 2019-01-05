import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { PaymentService } from '../../../service/payment.service';
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
  selector: 'app-payment-ridehistory',
  templateUrl: './payment-ridehistory.component.html',
  styleUrls: ['./payment-ridehistory.component.css']
})
export class PaymentRidehistoryComponent implements OnInit {
  rides:any;
  user:any;
  status:any;
  filter:any;
  constructor(private service:PaymentService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private authService:AuthService, private location: Location) 
    { this.toastr.setRootViewContainerRef(vcr); 
    
      this.status = [
        "cancelled","completed","onride","ontheway","scheduled","accepted","ridenotaccepted"
      ]
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.rides = this.service.getRides(params['id']).subscribe(res => {
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

  key: string = '_id'; //set default

  reverse: boolean = false;

  sort(key){

    this.key = key;

    this.reverse = !this.reverse;
   
  
  }
  p: number = 1;


}
