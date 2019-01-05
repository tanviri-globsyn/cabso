import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqService } from '../../../service/faq.service';
import { PageService } from '../../../service/page.service';
import { AuthService } from './../../../service/auth.service';
@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  faq: any;
  pages: any;
  user:any;
  count:any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService,
    private service: FaqService,private pageservice:PageService ) 
    {  this.pageservice.getUserPage().subscribe(res => {
      this.pages =  res;
    }); }

    ngOnInit() {
      this.route.params.subscribe(params => {
        this.faq = this.service.edit(params['id']).subscribe(res => {
          this.faq = res;
        });
      });
       this.authService.getUserinfo().subscribe(res => {
        this.user = res.user;
     });

     this.pageservice.getuserHelpCount().subscribe(res => {
      this.count = res;
    
    });
    }

}
