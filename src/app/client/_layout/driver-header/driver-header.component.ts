import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { PageService } from '../../../service/page.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-driver-header',
  templateUrl: './driver-header.component.html',
  styleUrls: ['./driver-header.component.css']
})
export class DriverHeaderComponent implements OnInit {
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
