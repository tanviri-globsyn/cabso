import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl+'/vehicleRoutes';

@Injectable()
export class VehicleService {

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


  getcount(){
    return this
            .https
            .get(API_URL+'/totalCount/')
            .map(res => {
              return res.json();
                    });
  }

  getCategory() {
    return this
            .http
            .get(API_URL+'/category')
            .map(res => {
              return res;
            });
  }

  edit(id) {
    return this
            .http
            .get(API_URL+'/edit/'+id)
            .map(res => {
              return res;
            });
  }

  update(page, id) {
    const obj = {
      category: page.category,
      status:page.status,
      user_id:page.user_id,
      inspectionon:page.datepicker
    };
    return  this
      .https
      .post(API_URL+'/update/'+id, obj)
      .map(res => {
        return res.json();
      });
  }


}
