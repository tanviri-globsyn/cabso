import { Component, OnInit } from '@angular/core';
import { PageService } from '../../../service/page.service';
import { AuthService } from '../../../service/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user:any;
  count:any;
  pages:any;
  url:any;
  constructor(private authService:AuthService, private service:PageService) { }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.authService.getUserinfo().subscribe(res => {
      this.user = res.user;
    
   });

   this.service.getdriverHelpCount().subscribe(res => {
    this.count = res;
  });
  this.service.getDriverHelppage().subscribe(res => {
    this.pages = res;
  });
  }

}
