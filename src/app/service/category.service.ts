import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions,Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/category';
@Injectable()
export class CategoryService {

  constructor(private http: HttpClient, private _http: Http) { }
  getContent() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }

  getBodyType() {
    const uri = API_URL+'/bodytype';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getAmenities() {
    const uri = API_URL+'/amenities';
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  add(page) {
    const uri = API_URL+'/add';
    const obj = {
      category_name: page.category_name,
      bodytypes:page.bodytypes,
      amenities:page.amenities,
      unitprice:page.unitprice,
      baseprice:page.baseprice
  };

   return  this._http.post(uri, obj)
   .map(res => {
    return res.json();
  });
  }


  public  updateImage(formData: any,id ) {
  
    let _url: string = API_URL+'/updateImage/'+id;
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
    console.log(page,id);
    const uri = API_URL+'/update/' + id;

    const obj = {
      category_name: page.category_name,
      bodytypes:page.bodytypes,  
      amenities:page.amenities,
      unitprice:page.unitprice,
      baseprice:page.baseprice 
    };
    return  this
      ._http
      .post(uri, obj)
      .map(res => {
        return res.json();
      });
  }


  delete(id) {
    const uri = API_URL+'/delete/' + id;

        return this
            ._http
            .get(uri)
            .map(res => {
              return res.json();
            });
  }

}
