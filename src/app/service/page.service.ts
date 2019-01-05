import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/page';
@Injectable()
export class PageService {

  constructor(private http: HttpClient, private https: Http) { }

  addPage(page) {
    const obj = {
      title: page.title,
      content: page.content,
      pagetype:page.pagetype,
      status:1,
      type:'driver',
    };
   return  this.https.post(API_URL+'/add', obj)
   .map(res => {
    return res.json();
  });
  }



  addUser(page) {
    const obj = {
      title: page.title,
      content: page.content,
      pagetype:page.pagetype,
      status:1,
      type:'user',
    };
   return  this.https.post(API_URL+'/addUser', obj)
   .map(res => {
    return res.json();
  });
  }


  getPage() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }



  getUserPage() {
    return this
            .http
            .get(API_URL+'/viewUser')
            .map(res => {
              return res;
            });
  }


  getTerms() {
    return this
            .http
            .get(API_URL+'/terms')
            .map(res => {
              return res;
            });
  }
  getPrivacy() {
    return this
            .http
            .get(API_URL+'/privacy')
            .map(res => {
              return res;
            });
  }
  
  getUserHelpcontent() {
    return this
            .http
            .get(API_URL+'/userHelp')
            .map(res => {
              return res;
            });
  }

  getDriverHelpcontent() {
    return this
            .http
            .get(API_URL+'/driverHelp')
            .map(res => {
              return res;
            });
  }

  getDriverTerms() {
    return this
            .http
            .get(API_URL+'/termsDriver')
            .map(res => {
              return res;
            });
  }
  getDriverPrivacy() {
    return this
            .http
            .get(API_URL+'/privacyDriver')
            .map(res => {
              return res;
            });
  }


  getDriverInspection() {
    return this
            .http
            .get(API_URL+'/inspectionDriver')
            .map(res => {
              return res;
            });
  }
  getDriverSecurity() {
    return this
            .http
            .get(API_URL+'/securityDriver')
            .map(res => {
              return res;
            });
  }


  deletePage(id) {
        return this
            .https
            .get(API_URL+'/delete/'+ id)
            .map(res => {
              return res.json();
            });
  }

  editPage(id) {
    return this
            .http
            .get(API_URL+'/edit/'+ id)
            .map(res => {
              return res;
            });
  }

  updatePage(page, id) {
    const obj = {
      title: page.title,
      content: page.content
    };
    this
      .http
      .post(API_URL+'/update/'+ id, obj)
      .subscribe(res => console.log('Done'));
  }


  getSocial() {
    return this
            .http
            .get(API_URL+'/social/')
            .map(res => {
              return res;
            });
  }



  getdriverHelpCount() {
    const uri = API_URL+'/driverHelpCount';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getuserHelpCount() {
    const uri = API_URL+'/userHelpCount';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  
  getDriverHelppage() {
    return this
            .http
            .get(API_URL+'/getDriverHelppage')
            .map(res => {
              return res;
            });
  }
}