import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AmenitiesService } from '../../../../service/amenities.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  amenities:any;
  constructor(private service:AmenitiesService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef)
     {this.toastr.setRootViewContainerRef(vcr); }

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
      this.amenities = res;
      if(this.amenities.length==0){
        this.router.navigate(['admin/amenities/add']);
       }
    });
  }


  delete(id) {
    this.service.delete(id).subscribe(data=>{
      if(data.success) {
        this.toastr.info(data.msg);  
        this.getPage();
        this.router.navigate(['admin/amenities/view']);
        window.scrollTo(0, 0);
       }
      if(data.error) {
        this.toastr.error(data.msg);
        window.scrollTo(0, 0);
      }
    });
}


}
