import { Component, OnInit } from '@angular/core';
import { AuthService } from './../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user:any;
  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.authService.getUserinfo().subscribe(res => {
      this.user = res.user;
    
   });
  }
  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
