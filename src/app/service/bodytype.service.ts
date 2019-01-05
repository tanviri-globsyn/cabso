import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/bodytype';
@Injectable()
export class BodytypeService {

  constructor(private http: HttpClient, private https: Http) { }

  getContent() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }

  add(page) {
    const uri = API_URL+'/add';
    const obj = {
      name: page.name,
  };
   return  this.https.post(uri, obj)
   .map(res => {
    return res.json();
  });
  }

  delete(id) {
    const uri = API_URL+'/delete/' + id;

        return this
            .https
            .get(uri)
            .map(res => {
              return res.json();
            });
  }
  edit(id) {
    const uri = API_URL+'/edit/' + id;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }


  update(page, id) {
    const uri = API_URL+'/update/' + id;

    const obj = {
      name: page.name,
     
    };
    return  this
      .https
      .post(uri, obj)
      .map(res => {
        return res.json();
      });
  }

}
