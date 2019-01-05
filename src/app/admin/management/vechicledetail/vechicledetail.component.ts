import { Component, OnInit,ElementRef,ViewContainerRef } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from '../../../service/vehicle.service';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-vechicledetail',
  templateUrl: './vechicledetail.component.html',
  styleUrls: ['./vechicledetail.component.css']
})
export class VechicledetailComponent implements OnInit {
  vehicle:any;
  details:any;
  options:any;
  today: any;
  currentdate: any;
  currenttime: any;
  inspectionon: any;
  inspectiontime: any;
  Form:FormGroup;
  url:any;
  constructor(private service: VehicleService,
    private fb:FormBuilder,
    private elem: ElementRef,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,private route: ActivatedRoute,
    private location: Location)
     { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.url=environment.apiUrl;
    this.route.params.subscribe(params => {
      this.vehicle = this.service.edit(params['id']).subscribe(res => {
        this.details = res;
        this.today = new Date();
        this.inspectionon = new Date(this.details.user_id.inspectionon);
        this.currenttime = Math.floor(this.today.getTime() / 1000);  
        this.inspectiontime =  Math.floor(this.inspectionon.getTime() / 1000);
      });
    });

    this.service.getCategory().subscribe(res => {
      this.options = res;
    });
    this.createForm();
  }
  createForm(){
    this.Form = this.fb.group({
      category:['',Validators.required],
      status:['',Validators.required],
      user_id:[''],
      datepicker: ['']
 });
}

update(form)
{
  if (this.Form.valid) {
    
  this.route.params.subscribe(params => {
    this.service.update(form, params['id']).subscribe(data=>{  
      if(data.success) {
        this.toastr.success(data.msg);
        window.scrollTo(0, 0); 
      }
    
    if(data.error) {
      this.toastr.error(data.msg); 
      window.scrollTo(0, 0);
      }
    });

  });
}
else
{
  this.validateAllFormFields(this.Form); 
}
}

validateAllFormFields(formGroup: FormGroup) {       
  Object.keys(formGroup.controls).forEach(field => { 
    const control = formGroup.get(field);            
    if (control instanceof FormControl) {            
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {       
      this.validateAllFormFields(control);            
    }
  });
}

goBack() {
  this.location.back(); 
}
}
