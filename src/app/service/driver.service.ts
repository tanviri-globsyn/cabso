import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/driverRoutes';
@Injectable()
export class DriverService {

  constructor(private http: HttpClient, private https: Http) { }



  getPage() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }

  deactiveUser(id) {
   
    const uri = API_URL+'/deactive/'+id;
    return  this.https.post(uri, id)
   .map(res => {
    return res.json();
  });
  }

  activeUser(id) {
   
    const uri = API_URL+'/active/'+id;
    return  this.https.post(uri, id)
   .map(res => {
    return res.json();
  });
  }

  getInfo(id){
    const uri = API_URL+'/info/' + id;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getcount(){
    const uri = API_URL+'/driverCount/';
    return this
            .https
            .get(uri)
            .map(res => {
              return res.json();
                    });
  }

  getonlineDrivercount(){
    const uri = API_URL+'/onlineDriver/';
    return this
            .https
            .get(uri)
            .map(res => {
              return res.json();
                    });
  }


  getactiveDrivercount(){
    const uri = API_URL+'/activeDriver/';
    return this
            .https
            .get(uri)
            .map(res => {
              return res.json();
                    });
  }


}
