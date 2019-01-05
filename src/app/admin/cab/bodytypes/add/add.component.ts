import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BodytypeService } from '../../../../service/bodytype.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  Form:FormGroup;
  constructor(private service:BodytypeService,
    private http: HttpClient,
    private fb:FormBuilder,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef
    ) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.Form = this.fb.group({
      name: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(30)])],
  
 });
  
}


add(page){
  if (this.Form.valid) {
  this.service.add(page).subscribe(data=>{ 
 
    if(data.success) {
    sessionStorage.setItem("SuccessMessage", data.msg);  
    this.router.navigate(['admin/bodytype/view']);
    window.scrollTo(0, 0);
    }
  
  if(data.error) {
    this.toastr.error(data.msg); 
    window.scrollTo(0, 0);

    }
  }
   
  );
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
