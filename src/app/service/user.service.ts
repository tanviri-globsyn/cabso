import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl+'/user';


@Injectable()
export class UserService {

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
   return  this.https.post(API_URL+'/deactive/'+id, id)
   .map(res => {
    return res.json();
  });
  }

  activeUser(id) {
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
            .get(API_URL+'/userCount/')
            .map(res => {
              return res.json();
                    });
  }

    getLatestuser() {
    return this
            .http
            .get(API_URL+'/latestUser/')
            .map(res => {
              return res;
            });
  }

  getiosuser() {
    return this
            .http
            .get(API_URL+'/iosUser/')
            .map(res => {
              return res;
            });
  }

  getandoriduser() {
    return this
            .http
            .get(API_URL+'/andoridUser/')
            .map(res => {
              return res;
            });
  }





  sendNotification(Form) {
    const obj = {
      message: Form.message,
      user: Form.user,
     };
     console.log(obj);
   return  this.https.post(API_URL+'/pushNotify', obj)
   .map(res => {
    return res;
  });
  }
}