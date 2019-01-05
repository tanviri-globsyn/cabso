import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { DriverService } from '../../../service/driver.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  pages:any;
  payment:any;
  filter:any;
  constructor(private service:DriverService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) 
    { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.getPage();
  }
  getPage() {
    this.service.getPage().subscribe(res => {
      this.pages = res;
    });
  }

  deactive(id)
{
  this.service.deactiveUser(id).subscribe(data=>{
    if(data.success) {
      this.toastr.success(data.msg, 'Success!');  
      this.getPage();
      this.router.navigate(['admin/management/driver']);
     }
    if(data.error) {
      this.toastr.error(data.msg, 'Error!');  
     
    }
  });
}


active(id)
{
  this.service.activeUser(id).subscribe(data=>{
    if(data.success) {
      this.toastr.success(data.msg, 'Success!');  
      this.getPage();
      this.router.navigate(['admin/management/driver']);
     }
    if(data.error) {
      this.toastr.error(data.msg, 'Error!');  
     
    }
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
