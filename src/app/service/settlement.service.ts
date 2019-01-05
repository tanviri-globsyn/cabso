import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/settlement';
@Injectable()
export class SettlementService {

  constructor(private http: HttpClient, private https: Http) { }


  getPage() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }

 add(driverID,totalFare,commissionAmt,tax,earn,countpage) {
  const uri = API_URL+'/add';
  const obj = {
    driver_id: driverID,
    total_ridefare: totalFare,
    total_commissionAmt:commissionAmt,
    total_tax:tax,
    total_earning:earn,
    ride_count:countpage,
    payment_status:1,
  };
 return  this.https.post(uri, obj)
 .map(res => {
  return res.json();
});
}


getcount(){
  return this
          .https
          .get(API_URL+'/totalCommission/')
          .map(res => {
            return res.json();
                  });
}




}
