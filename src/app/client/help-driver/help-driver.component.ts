import { Component, OnInit } from '@angular/core';
import { PageService } from './../../service/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';
@Component({
  selector: 'app-help-driver',
  templateUrl: './help-driver.component.html',
  styleUrls: ['./help-driver.component.css']
})
export class HelpDriverComponent implements OnInit {
  page: any;
  pages: any;
  user:any;
  constructor(private service:PageService,
    private router: Router,
    private authService:AuthService,
    private route: ActivatedRoute,) {
     this.route.params.subscribe(params => {
      this.page = this.service.editPage(params['id']).subscribe(res => {
        this.page = res;
      });
     });
   }

  ngOnInit() {
    this.getPage();
    this.authService.getUserinfo().subscribe(res => {
        this.user = res.user;
        console.log(this.user);
     });
  }

  getPage() {
    this.service.getPage().subscribe(res => {
      this.pages =  res;
    });
  }

 
}
