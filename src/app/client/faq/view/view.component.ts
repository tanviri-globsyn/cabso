import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../../service/faq.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../service/page.service';
import { AuthService } from './../../../service/auth.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  faq: any;
  pages: any;
  user:any;
  count:any;
  constructor(private service:FaqService,
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthService,
    private pageservice:PageService) {
      this.pageservice.getUserPage().subscribe(res => {
        this.pages =  res;
      });
     }
   
   
    ngOnInit() {
      this.getPage();
      this.authService.getUserinfo().subscribe(res => {
        this.user = res.user;
     });
     this.pageservice.getuserHelpCount().subscribe(res => {
      this.count = res;
    
    });
     
    }
  
    getPage() {
      this.service.getContent().subscribe(res => {
        this.faq = res;
      
      });
    }
}
