import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { PageService } from '../../../service/page.service';
@Component({
  selector: 'app-driver-footer',
  templateUrl: './driver-footer.component.html',
  styleUrls: ['./driver-footer.component.css']
})
export class DriverFooterComponent implements OnInit {
  user:any;
  pages:any;
  privacy:any;
  inspection:any;
  security:any;
  helpContent:any;
  count:any;
  constructor(private authService:AuthService, private service:PageService) { }

  ngOnInit() {
    this.authService.getUserinfo().subscribe(res => {
       this.user = res.user;
     
    });

    this.service.getDriverTerms().subscribe(res => {
      this.pages = res;
    });

    this.service.getDriverPrivacy().subscribe(res => {
      this.privacy = res;
    });

    this.service.getDriverInspection().subscribe(res => {
      this.inspection = res;
    });

    this.service.getDriverSecurity().subscribe(res => {
      this.security = res;
    });
    
    this.service.getDriverHelpcontent().subscribe(res => {
      this.helpContent = res;
    });

  }
}
