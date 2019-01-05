import { Component, OnInit } from '@angular/core';
import { HomeService } from './../../service/home.service';
import { AuthService } from './../../service/auth.service';
import { BannerService } from './../../service/banner.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  home:any;
  user:any;
  pages:any;
  backgroundUrl:String;
  driverCount:any;
  url:any;
  constructor(private service:HomeService,
              private authService:AuthService,
              private banner:BannerService ) { }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.service.getDriverHome().subscribe(res => {
      this.home = res;
    
    });
    this.authService.getUserinfo().subscribe(profile => {
      this.user = profile.user;
    });
    this.banner.getDriverBanner().subscribe(res => {
      this.pages = res;
      if(this.pages.image)
      {
        this.backgroundUrl=environment.apiUrl+'/assets/banner/'+this.pages.image;
      } else
      {
        this.backgroundUrl=environment.apiUrl+'/assets/app-user/images/home/banner1.jpg';
      }
    });

    this.banner.getDriverCount().subscribe(res => {
      this.driverCount = res;
    });
  }

}
