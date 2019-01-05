import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../../service/auth.service';
import { DriverService } from '../../service/driver.service';
import { VehicleService } from '../../service/vehicle.service';
import { RidesService } from '../../service/rides.service';
import { SettlementService } from '../../service/settlement.service';
import { environment } from './../../../environments/environment';

import { Http, Headers } from '@angular/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Form: FormGroup;
  count: any;
  driverCount: any;
  vehicleCount: any;
  ridesCount: any;
  totalRide: any;
  latestUser: any;
  latestRide: any;
  status1: any;
  status2: any;
  status3: any;
  status4: any;
  status5: any;
  status6: any;
  status7: any; onlineDriverCount: any; activedriverCount: any;
  todayRide: any; iosUser: any; andoridUser: any; revenue: any;
  url: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private user: UserService,
    private driver: DriverService,
    private vehicle: VehicleService,
    private ride: RidesService,
    private https: Http,
    private settlement: SettlementService,
    public toastr: ToastsManager, vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.user.getcount().subscribe(res => {
      this.count = res;
    });

    this.driver.getcount().subscribe(res => {
      this.driverCount = res;
    });

    this.driver.getonlineDrivercount().subscribe(res => {
      this.onlineDriverCount = res;
      localStorage.setItem('onlineDriver', this.onlineDriverCount);
    });


    this.driver.getactiveDrivercount().subscribe(res => {
      this.activedriverCount = res;
      localStorage.setItem('activeDriver', this.activedriverCount);

    });

    this.vehicle.getcount().subscribe(res => {
      this.vehicleCount = res;
    });


    this.ride.getcount().subscribe(res => {
      this.totalRide = res;
      localStorage.setItem('totalridecount', this.totalRide);

    });

    this.ride.getcurrentMonthride().subscribe(res => {
      this.ridesCount = res;
      localStorage.setItem('counter', this.ridesCount);
    });
    this.user.getLatestuser().subscribe(res => {
      this.latestUser = res;
    });

    this.user.getiosuser().subscribe(res => {
      this.iosUser = res;
      localStorage.setItem('iosuser', this.iosUser);

    });
    this.user.getandoriduser().subscribe(res => {
      this.andoridUser = res;
      localStorage.setItem('andoriduser', this.andoridUser);

    });

    this.ride.gettodayCount().subscribe(res => {
      this.todayRide = res;
    });


    this.ride.getLatestride().subscribe(res => {
      this.latestRide = res;
    });

    // start count for ride status
    this.ride.getCancelCount().subscribe(res => {
      this.status1 = res;
      localStorage.setItem('status1', this.status1);
    });

    this.ride.getCompletedCount().subscribe(res => {
      this.status2 = res;
      localStorage.setItem('status2', this.status2);
    });

    this.ride.getOnrideCount().subscribe(res => {
      this.status3 = res;
      localStorage.setItem('status3', this.status3);
    });

    this.ride.getOnthewayCount().subscribe(res => {
      this.status4 = res;
      localStorage.setItem('status4', this.status4);
    });

    this.ride.getScheduledCount().subscribe(res => {
      this.status5 = res;
      localStorage.setItem('status5', this.status5);
    });

    this.ride.getAcceptedCount().subscribe(res => {
      this.status6 = res;
      localStorage.setItem('status6', this.status6);
    });

    this.ride.getNotAcceptCount().subscribe(res => {
      this.status7 = res;
      localStorage.setItem('status7', this.status7);
    });

    this.settlement.getcount().subscribe(res => {
      this.revenue = res;
    });

    // end count for ride status 

    this.createForm();


  }


  createForm() {
    this.Form = this.fb.group({
      message: ['', Validators.required],
      user: ['', Validators.required]

    });

  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['admin/login']);
    return false;
  }
  //pie charts
  public pieChartLabels: string[] = ['Online Drivers', 'Active Drivers'];
  public pieChartData: number[] = [parseInt(localStorage.getItem('onlineDriver')), parseInt(localStorage.getItem('activeDriver'))];
  public pieChartType: string = 'pie';
  //end pie charts
  // events
  // public chartClicked(e:any):void {
  //   console.log(e);
  // }

  // public chartHovered(e:any):void {
  //   console.log(e);
  // }
  //doughnut charts
  public chartType: string = 'doughnut';

  public chartData: Array<any> = [parseInt(localStorage.getItem('status1')), parseInt(localStorage.getItem('status2')), parseInt(localStorage.getItem('status3')), parseInt(localStorage.getItem('status4')), parseInt(localStorage.getItem('status5')), parseInt(localStorage.getItem('status6')), parseInt(localStorage.getItem('status7'))];
  public chartLabels: Array<any> = ['Cancel', 'Completed', 'On Ride', 'On the Way', 'Scheduled', 'Accepted', 'Not Accepted'];

  public chartColors: Array<any> = [{
    hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
    hoverBorderWidth: 0,
    backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360", " #145a32", "#8e44ad"],
    hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774", "#145a32", "#8e44ad"]
  }];


  //end doughnut charts
  public chartOptions: any = {
    responsive: true
  };

  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }


  sendMessage(Form) {
    if (this.Form.valid) {
      //  this.user.sendNotification(Form);
      this.authService.getUserinfo().subscribe(res => {
        this.user = res.user;
        if (this.user[0].FCMUserKey === null || this.user[0].FCMUserKey === undefined || this.user[0].FCMUserKey === "") {
          this.toastr.error("User FCM Server key is empty");
          window.scrollTo(0, 0);
        }
        else if (this.user[0].FCMDriverKey === null || this.user[0].FCMDriverKey === undefined || this.user[0].FCMDriverKey === "") {
          this.toastr.error("Driver FCM Server key is empty");
          window.scrollTo(0, 0);
        }
        else {
          this.https.post(environment.apiUrl + '/user/pushNotify', Form).subscribe(res => res.json());
          this.toastr.success("Push Notification send Successfully");
          this.Form.reset();
          window.scrollTo(0, 0);
        }

      });




    }
    else {
      this.validateAllFormFields(this.Form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
