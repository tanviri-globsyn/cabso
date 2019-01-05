import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { FaqService } from '../../../service/faq.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  faq: any;
  constructor(private service:FaqService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

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
      this.faq = res;
      if(this.faq.length==0){
        this.router.navigate(['admin/faq/add']);
       }
    });
  }
  delete(id) {
    this.service.delete(id).subscribe(data=>{
      if(data.success) {
        this.toastr.info(data.msg);        
        this.getPage();
        window.scrollTo(0, 0);
       // this.router.navigate(['admin/faq/view']);
       }
      if(data.error) {
        window.scrollTo(0, 0);
        this.toastr.error(data.msg);
       }
    });
}


}
