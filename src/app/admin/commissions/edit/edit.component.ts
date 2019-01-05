import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommissionsService } from '../../../service/commissions.service';
import { FormGroup,  FormBuilder,FormControl, Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  tax: any;
  Form: FormGroup;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: CommissionsService, private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef) 
    {   this.toastr.setRootViewContainerRef(vcr); 
      this.createForm(); }

  ngOnInit() {
      this.route.params.subscribe(params => {
      this.tax = this.service.edit(params['id']).subscribe(res => {
        this.tax = res;
      });
    });
  }
 
  createForm() {
    this.Form = this.fb.group({
      price_from: ['', Validators.required],
      price_to:['', Validators.required],
      percentage:['',Validators.required],
   });
  }

  update(page) {
    if (this.Form.valid) {

    this.route.params.subscribe(params => {
    this.service.update(page, params['id']).subscribe(data=>{
      if(data.success) {
       sessionStorage.setItem("SuccessMessage", data.msg);  
      // this.getPage();
        this.router.navigate(['admin/commissions/view']);
       }
      if(data.error) {
        this.toastr.error(data.msg);  
      }
    });

  });
} else {
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
}
