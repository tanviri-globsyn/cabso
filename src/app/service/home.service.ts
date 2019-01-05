import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions,Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/home';
@Injectable()

@Injectable()
export class HomeService {

  constructor(private http: HttpClient, private _http: Http) { }

  getContent() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }

  getDriverHome() {
    const uri = API_URL+'/driverhome';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }


  public  uploadImage(formData: any ) {
    let _url: string = API_URL+'/upload';
    return this._http.post(_url, formData)
    .catch(this._errorHandler)
    .map(res => {
      return res.json();
    }); ;
  }


  public  uploadDriver(formData: any ) {
    let _url: string = API_URL+'/uploadDriver';
    return this._http.post(_url, formData)
    .catch(this._errorHandler) 
    .map(res => {
      return res.json();
    }); 
  }
   
  updatePage(formData: any, id) {
    let _url: string = API_URL+'/update/' + id;   
    return this ._http.post(_url, formData)
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


  deletePage(id) {
    const uri = API_URL+'/delete/' + id;

        return this
            ._http
            .get(uri)
            .map(res => {
              return res.json();
            });
  }


}
