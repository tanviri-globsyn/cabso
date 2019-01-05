import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  pages: any;
  filter: any;
  constructor(private service: UserService,
    private http: HttpClient,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.service.getPage().subscribe(res => {
      this.pages = res;
    });
  }

  deactive(id) {
    this.service.deactiveUser(id).subscribe(data => {
      if (data.success) {
        this.toastr.success(data.msg, 'Success!');
        this.getPage();
        this.router.navigate(['admin/management/user']);
      }
      if (data.error) {
        this.toastr.error(data.msg, 'Error!');

      }
    });
  }


  active(id) {
    this.service.activeUser(id).subscribe(data => {
      if (data.success) {
        this.toastr.success(data.msg);
        this.getPage();
        this.router.navigate(['admin/management/user']);
        window.scrollTo(0, 0);
      }
      if (data.error) {
        this.toastr.error(data.msg);
        window.scrollTo(0, 0);

      }
    });
  }

  key: string = '_id'; //set default

  reverse: boolean = false;

  sort(key) {

    this.key = key;

    this.reverse = !this.reverse;


  }
  p: number = 1;

}
