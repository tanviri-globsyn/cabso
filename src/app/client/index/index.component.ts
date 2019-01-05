import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { HomeService } from './../../service/home.service';
import { PageService } from './../../service/page.service';
import { BannerService } from './../../service/banner.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  user:any;
  home:any;
  pages:any;
  backgroundUrl:String;
  userCount:any;
  url:any;
  constructor(private authService:AuthService, 
    private service:HomeService,
  private data:PageService,
private banner:BannerService) {     
 }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.authService.getUserinfo().subscribe(profile => {
      this.user = profile.user;
    });

    this.service.getContent().subscribe(res => {
      this.home = res;
    
    });

    this.banner.getUserBanner().subscribe(res => {
      this.pages = res;
      if(this.pages.image)
      {
        this.backgroundUrl=environment.apiUrl+'/assets/banner/'+this.pages.image;
      } else
      {
        this.backgroundUrl=environment.apiUrl+'/assets/app-user/images/driver/driver_banner.jpg';
      }
    });

    this.banner.getUserCount().subscribe(res => {
      this.userCount = res;
    });
  }

}
