import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { PageService } from '../../../service/page.service';
import { FaqService } from '../../../service/faq.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  user:any;
  pages:any;
  privacy:any;
  links:any;
  helpContent:any;
  faqCount:any;
  constructor(private authService:AuthService, private service:PageService,
  private faq:FaqService) { }

  ngOnInit() {
    this.authService.getUserinfo().subscribe(res => {
       this.user = res.user;
     
    });

     this.service.getPage().subscribe(res => {
      this.links = res;
    });

    this.service.getTerms().subscribe(res => {
      this.pages = res;
    });

    this.service.getPrivacy().subscribe(res => {
      this.privacy = res;
    });

    this.service.getUserHelpcontent().subscribe(res => {
      this.helpContent = res;
    });
    this.faq.getCount().subscribe(res => {
      this.faqCount = res;
    });
    
  }

}
