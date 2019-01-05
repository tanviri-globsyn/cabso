import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/payment';

@Injectable()
export class PaymentService {

  constructor(private http: HttpClient, private https: Http) { }

  getPage() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
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


  getDriverPay(){
    return this
            .http
            .get(API_URL+'/totalAmt/')
            .map(res => {
              return res;
            });
  }

  pay(id) {
     return  this.https.post(API_URL+'/paymentDriver', +id)
   .map(res => {
    return res.json();
  });
  }
  getRides(id){
    return this
            .http
            .get(API_URL+'/getRides/'+id)
            .map(res => {
              return res;
            });
  }


}
