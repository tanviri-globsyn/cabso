import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { Observable } from 'rxjs/Observable';
import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user:any;
  url:any;
  dropdown:any;
  open: true;
  isCollapsed=true;
  constructor( private router:Router,private service:AuthService) { }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.service.getUserinfo().subscribe(res => {
      this.user = res.user;
   });
  }


  change(id){
    this.dropdown = id;
  } 
 

 
}





 