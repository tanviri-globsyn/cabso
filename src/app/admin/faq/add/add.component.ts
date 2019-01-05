import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { FormGroup,  FormBuilder,FormControl,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FaqService } from '../../../service/faq.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  Form:FormGroup;
  faq: any;
  constructor(private service:FaqService,
    private http: HttpClient,
    private fb:FormBuilder,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) 
    { this.toastr.setRootViewContainerRef(vcr); }

  
    ngOnInit() {
      this.createForm();
    }
  
  
    createForm(){
        this.Form = this.fb.group({
          title: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(30)])],
          content:['', Validators.required],
      });
      
    }

    getPage() {
      this.service.getContent().subscribe(res => {
        this.faq = res;
        if(this.faq.length==0){
          this.router.navigate(['admin/faq/add']);
         }
      });
    }



    add(page){
      if (this.Form.valid) {
      this.service.add(page).subscribe(data=>{ 
     
        if(data.success) {
          sessionStorage.setItem("SuccessMessage", data.msg);  
          this.getPage();
          window.scrollTo(0, 0);
        this.router.navigate(['admin/faq/view']);
        }
      
      if(data.error) {
        window.scrollTo(0, 0);
        this.toastr.error(data.msg); 
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
