import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BodytypeService } from '../../../../service/bodytype.service';
import { FormGroup,  FormBuilder,FormControl,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  bodytype: any;
  Form:FormGroup;
  bodytypes:any
  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: BodytypeService, 
    private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef)

    { this.createForm();
      this.toastr.setRootViewContainerRef(vcr);  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bodytype = this.service.edit(params['id']).subscribe(res => {
        this.bodytype = res;
      });
    });
  }

  createForm() {
    this.Form = this.fb.group({
      name: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(30)])],
     
   });
  }
  getPage() {
    this.service.getContent().subscribe(res => {
      this.bodytypes = res;
      if(this.bodytypes.length==0){
        this.router.navigate(['admin/bodytype/add']);
       }
    });
  }
  update(page) {
    if (this.Form.valid) {

    this.route.params.subscribe(params => {
    this.service.update(page, params['id']).subscribe(data=>{
      if(data.success) {
       sessionStorage.setItem("SuccessMessage", data.msg);  
       this.getPage();
        this.router.navigate(['admin/bodytype/view']);
        window.scrollTo(0, 0);

       }
      if(data.error) {
        this.toastr.error(data.msg);  
        window.scrollTo(0, 0);

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
