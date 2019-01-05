import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/rides';

@Injectable()
export class RidesService {

  constructor(private http: HttpClient, private https: Http) { }

  getPage() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }

  deactiveVehicle(id) {
   
    return  this.https.post(API_URL+'/deactive/'+id, id)
   .map(res => {
    return res.json();
  });
  }

  activeVehicle(id) {
   
    return  this.https.post(API_URL+'/active/'+id, id)
   .map(res => {
    return res.json();
  });
  }


  getInfo(id){
    return this
            .http
            .get(API_URL+'/info/'+id)
            .map(res => {
              return res;
            });
  }



  getDriverRide(id){
    return this
            .http
            .get(API_URL+'/getDriverRide/'+id)
            .map(res => {
              return res;
            });
  }

  
  getDriverRideCount(id){
    return this
            .http
            .get(API_URL+'/getDriverRideCount/'+id)
            .map(res => {
              return res;
            });
  }

  
  getcount(){
    return this
            .https
            .get(API_URL+'/totalCount/')
            .map(res => {
              return res.json();
                    });
  }


  getcurrentMonthride(){
    return this
            .https
            .get(API_URL+'/currentMonth/')
            .map(res => {
              return res.json();
                    });
  }


  getLatestride() {
    return this
            .http
            .get(API_URL+'/latestRide/')
            .map(res => {
              return res;
            });
  }

    
  getCancelCount(){
    return this
            .http
            .get(API_URL+'/cancel/')
            .map(res => {
              return res;
            });
  }


      
  getCompletedCount(){
    return this
            .http
            .get(API_URL+'/completed/')
            .map(res => {
              return res;
            });
  }

      
  getOnrideCount(){
    return this
            .http
            .get(API_URL+'/onride/')
            .map(res => {
              return res;
            });
  }
      
  getOnthewayCount(){
    return this
            .http
            .get(API_URL+'/ontheway/')
            .map(res => {
              return res;
            });
  }

      
  getScheduledCount(){
    return this
            .http
            .get(API_URL+'/scheduled/')
            .map(res => {
              return res;
            });
  }

      
  getAcceptedCount(){
    return this
            .http
            .get(API_URL+'/accepted/')
            .map(res => {
              return res;
            });
  }

      
  getNotAcceptCount(){
    return this
            .http
            .get(API_URL+'/ridenotaccepted/')
            .map(res => {
              return res;
            });
  }

  gettodayCount(){
    return this
            .http
            .get(API_URL+'/currentRecords/')
            .map(res => {
              return res;
            });
  }




  
}

