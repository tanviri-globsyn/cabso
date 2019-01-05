import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { HomeService } from '../../../service/home.service';
import { Location} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  pages:any;
  url:any;
  constructor(private service:HomeService,
    private http: HttpClient,
    private router: Router, private _location: Location,
    public toastr: ToastsManager, vcr: ViewContainerRef
  ) {   this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.getContent();
    if (sessionStorage['SuccessMessage']) {
      this.toastr.success( sessionStorage.getItem("SuccessMessage"));
      sessionStorage.clear();
   }
    

   if (sessionStorage['ErrorMessage']) {
    this.toastr.error( sessionStorage.getItem("ErrorMessage"));
    sessionStorage.clear();
 }
  }

  getContent() {
    this.service.getDriverHome().subscribe(res => {
      this.pages = res;
      if(this.pages.length==0){
        this.router.navigate(['admin/home/adddriver']);
       }
    });
  }

  deletePage(id) {
    this.service.deletePage(id).subscribe(data=>{
      if(data.success) {
        this.toastr.info(data.msg);  
         this.getContent();
         window.scrollTo(0, 0);
        this.router.navigate(['admin/driver/view']);
       }
      if(data.error) {
        this.toastr.error(data.msg);  
      }
    });
}



}
