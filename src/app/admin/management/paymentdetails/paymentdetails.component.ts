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

@Component({
  selector: 'app-paymentdetails',
  templateUrl: './paymentdetails.component.html',
  styleUrls: ['./paymentdetails.component.css']
})
export class PaymentdetailsComponent implements OnInit {
  payment:any;
  user:any;
  constructor(private service:PaymentService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private authService:AuthService) 
    { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.payment = this.service.getInfo(params['id']).subscribe(res => {
        this.payment = res;
       });
    });
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
   });
  }

}
