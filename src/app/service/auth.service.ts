import { Injectable } from '@angular/core';
import { Http, Headers,RequestOptions,Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/admin';
@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  _url: string;

  constructor(private http: Http, private Httpclient:HttpClient) {
     // this.isDev = true;  // Change to false before deployment
      }

      registerUser(user) {
        let headers = new Headers();
       // headers.append('Content-Type', 'application/json');
        return this.http.post(API_URL+'/register', user, {headers: headers})
          .map(res => res.json());
      }
    
      authenticateUser(user) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(API_URL+'/authenticate', user, {headers: headers})
          .map(res => res.json());
      }
    
      getProfile() {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
       // headers.append('Content-Type', 'application/json');
        return this.http.get(API_URL+'/profile', {headers: headers})
          .map(res => res.json());
      }





  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }


private _errorHandler(error: Response) {
  console.error('Error Occured: ' + error);
  return Observable.throw(error || 'Some Error on Server Occured');

}


updateLogo(formData: any, id) {
  const uri = API_URL+'/logo/' + id; 
  return  this
    .http
    .post(uri, formData)
    .catch(this._errorHandler)
  .map(res => {
    return res.json();
  });
}


updateFavicon(formData: any, id) {
  const uri = API_URL+'/favicon/' + id; 
  return  this
    .http
    .post(uri, formData)
    .catch(this._errorHandler)
  .map(res => {
    return res.json();
  });
}


  updateEmail(user,id){
    return  this
        .http
        .post(API_URL+'/update/'+id, user)
        .map(res => res.json());
     }
     updateSetting(user,id,symbol){
      const obj = {
        username: user.username,
        email: user.email,
        footer: user.footer,
        apptitle: user.apptitle,
        appcontent: user.appcontent,
        phone: user.phone,
        distancePerCab: user.distancePerCab,
        tax: user.tax,
        maxDistance: user.maxDistance,
        currencyCode: user.currencyCode,
        siteName: user.siteName,
        currencySymbol:symbol,
        emergencyContact:user.emergencyContact,
        FCMUserKey:user.FCMUserKey,
        FCMDriverKey:user.FCMDriverKey,
        googleMapKey:user.googleMapKey,
        inspectionon:user.inspectionon,
        helppagesheader:user.helppagesheader,
        maxdisperride:user.maxdisperride,
    };
    console.log(symbol);
      return  this
          .http
          .post(API_URL+'/setting/'+id, obj)
          .map(res => res.json());
       }
   

       updateSMTP(user,id){
         return  this
            .http
            .post(API_URL+'/emailSetting/'+id, user)
            .map(res => res.json());
         }
     

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  getUserinfo() {
    return this.http.get(API_URL+'/getProfile')
      .map(res => res.json());
  }
  sendMail(form){
  
    return  this
          .http
          .post(API_URL+'/sendMail/', form)
          .map(res => {
            return res.json();
          });
       }
 


    ChangePassword(profile,id){
    return  this
        .http
        .post(API_URL+'/changePassword/'+id, profile)
        .map(res =>{
          return res.json();
        });
     }
 
  
     updateApp(user,id){
      return  this
          .http
          .post(API_URL+'/app/'+id, user)
          .map(res => res.json());
       }
   
       updatePayment(payment,id){
        return  this
           .http
           .post(API_URL+'/payment/'+id, payment)
           .map(res => res.json());
        }
    

}
