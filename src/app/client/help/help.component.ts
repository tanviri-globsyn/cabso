import { Component, OnInit } from '@angular/core';
import { PageService } from './../../service/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';
import { FaqService } from './../../service/faq.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  page: any;
  pages: any;
  user:any;
  count:any;
  faqCount:any;
  constructor(private service:PageService,
    private router: Router,
    private authService:AuthService,
    private route: ActivatedRoute,private faq:FaqService) {
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
     });

     this.service.getuserHelpCount().subscribe(res => {
      this.count = res;
    
    });
    this.faq.getCount().subscribe(res => {
      this.faqCount = res;
    });
  }

  getPage() {
    this.service.getUserPage().subscribe(res => {
      this.pages =  res;
    });
  }

 
}
