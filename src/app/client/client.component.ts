import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/banner';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  API_URL:any=environment.apiUrl;
  constructor() { }
   
  ngOnInit() {
  }

}
