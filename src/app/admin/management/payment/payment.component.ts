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

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payment:any;
  user:any;
  filter:any;
  constructor(private service:PaymentService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private authService:AuthService) 
    {this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.getPage();
  }


  getPage() {
    this.service.getPage().subscribe(res => {
      this.payment = res;
    });
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
   });
  }
  
  key: string = '_id'; //set default

  reverse: boolean = false;

  sort(key){

    this.key = key;

    this.reverse = !this.reverse;
   
  
  }
  p: number = 1;


}
