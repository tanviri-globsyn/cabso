import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { PaymentService } from '../../../service/payment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../../../service/auth.service';
import { SettlementService } from '../../../service/settlement.service';



@Component({
  selector: 'app-driver-pay',
  templateUrl: './driver-pay.component.html',
  styleUrls: ['./driver-pay.component.css']
})
export class DriverPayComponent implements OnInit {
  payment:any;
  user:any;
  filter:any;
  constructor(private service:PaymentService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private authService:AuthService, private settlement:SettlementService,
) 
    {this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.getPage();
  }


  getPage() {
    this.service.getDriverPay().subscribe(res => {
      if(res=="undefined"){
        this.payment = [];
      }
      else{
        this.payment = res;
      }
    });
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
   });
  }
   
  payDriver(driverID,totalFare,commissionAmt,tax,earn,count){
    this.settlement.add(driverID,totalFare,commissionAmt,tax,earn,count).subscribe(data=>{ 
      if(data.success) {
        this.getPage();  
        this.toastr.success(data.msg); 
        window.scrollTo(0, 0);   
     }
     if(data.error) {
      this.toastr.error(data.msg); 
      window.scrollTo(0, 0);
    }
    })
  };

  key: string = '_id'; //set default

  reverse: boolean = false;

  sort(key){

    this.key = key;

    this.reverse = !this.reverse;
   
  
  }
  p: number = 1;

  }


