import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { CommissionsService } from '../../../service/commissions.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  tax:any;
  constructor(private service:CommissionsService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef)
     {  this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {

    this.getPage();

    if (sessionStorage['SuccessMessage']) {
      this.toastr.success( sessionStorage.getItem("SuccessMessage"));
      sessionStorage.clear();
   }
    

   if (sessionStorage['ErrorMessage']) {
    this.toastr.error( sessionStorage.getItem("ErrorMessage"));
    sessionStorage.clear();
 }
  }


  getPage() {
    this.service.getContent().subscribe(res => {
      this.tax = res;
      if(this.tax.length==0){
        this.router.navigate(['admin/commissions/add']);
       }
    });
  }

  delete(id) {
    this.service.delete(id).subscribe(data=>{
      if(data.success) {
        this.toastr.info(data.msg);        
        this.getPage();
        window.scrollTo(0, 0);
       }
      if(data.error) {
        window.scrollTo(0, 0);
        this.toastr.error(data.msg);  
     
      }
    });
}
}
