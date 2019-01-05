import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { environment } from '../../../../environments/environment';
import { FaqService } from '../../../service/faq.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  user:any;
  url:any;
  faqCount:any;
  constructor(private authService:AuthService,private faq:FaqService) { }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.authService.getUserinfo().subscribe(res => {
      this.user = res.user;
    
   });

   this.faq.getCount().subscribe(res => {
    this.faqCount = res;
  });
  }

}
