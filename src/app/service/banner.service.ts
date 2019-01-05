import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions,Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/banner';
@Injectable()
export class BannerService {

  constructor(private http: HttpClient, private _http: Http) { }

  getContent() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }

  public  addBanner(formData: any ) {
    let _url: string = API_URL+'/add';
    return this._http.post(_url, formData)
    .catch(this._errorHandler)
    .map(res => {
      return res.json();
    });
  }
  
  private _errorHandler(error: Response) {
    console.error('Error Occured: ' + error);
    return Observable.throw(error || 'Some Error on Server Occured');
  
  }

  editPage(id) {
    const uri = API_URL+'/edit/' + id;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  updatePage(formData: any, id) {
    const uri = API_URL+'/update/' + id;
   
    return  this
      ._http
      .post(uri, formData)
      .catch(this._errorHandler)
    .map(res => {
      return res.json();
    });
  }
  
  
  updatePageImage(formData: any, id) {
    let _url: string = API_URL+'/updateImage/' + id;   
    return this._http.post(_url, formData)
    .catch(this._errorHandler)
    .map(res => {
      return res.json();
    });
  }

  //home page

  getUserBanner() {
    const uri = API_URL+'/user';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getDriverBanner() {
    const uri = API_URL+'/driver';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }


  deletePage(id) {
    const uri = API_URL+'/delete/' + id;

        return this
            ._http
            .get(uri)
            .map(res => {
              return res.json();
            });
  }


  getCount() {
    const uri = API_URL+'/count';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getUserCount() {
    const uri = API_URL+'/userCount';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getDriverCount() {
    const uri = API_URL+'/driverCount';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
}
