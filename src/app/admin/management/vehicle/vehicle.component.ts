import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { VehicleService } from '../../../service/vehicle.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  vehicle:any;
  options:any;
  filter:any;
  constructor(private service:VehicleService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) 
    {this.toastr.setRootViewContainerRef(vcr);  }

  ngOnInit() {
    this.getPage();
    this.service.getCategory().subscribe(res => {
      this.options = res;
    });
  }

  getPage() {
    this.service.getPage().subscribe(res => {
      this.vehicle = res;
    });
  }

  deactive(id)
{
  this.service.deactiveVehicle(id).subscribe(data=>{
    if(data.success) {
      this.toastr.info(data.msg);  
      this.getPage();
      this.router.navigate(['admin/management/vehicle']);
      window.scrollTo(0, 0);
     }
    if(data.error) {
      window.scrollTo(0, 0);
      this.toastr.error(data.msg);  
     
    }
  });
}


active(id)
{
  this.service.activeVehicle(id).subscribe(data=>{
    if(data.success) {
      this.toastr.success(data.msg);  
      this.getPage();
      this.router.navigate(['admin/management/vehicle']);
     }
    if(data.error) {
      this.toastr.error(data.msg);  
     
    }
  });
}

key: string = 'name'; //set default

  reverse: boolean = false;

  sort(key){

    this.key = key;

    this.reverse = !this.reverse;
   
  
  }
  p: number = 1;

}

