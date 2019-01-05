import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { SettlementService } from '../../../service/settlement.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-settlement-history',
  templateUrl: './settlement-history.component.html',
  styleUrls: ['./settlement-history.component.css']
})
export class SettlementHistoryComponent implements OnInit {
  settlement:any;
  user:any;
  filter:any;
  constructor(private service:SettlementService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,private authService:AuthService,
  )  {this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.service.getPage().subscribe(res => {
      this.settlement = res;
        
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
