import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqService } from '../../../service/faq.service';
import { FormGroup,  FormBuilder,FormControl,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
;
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  faq: any;
  Form: FormGroup;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: FaqService, private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef
  ) { this.createForm();
    this.toastr.setRootViewContainerRef(vcr); }

    createForm() {
      this.Form = this.fb.group({
        title: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(30)])],
        content: ['', Validators.required ]
     });
    }

    update(faq) {
      if (this.Form.valid) {
      this.route.params.subscribe(params => {
      this.service.update(faq, params['id']).subscribe(data=>{ 
     
        if(data.success) {
          sessionStorage.setItem("SuccessMessage", "Faq Updated Successfully");    
          this.getPage();
          window.scrollTo(0, 0);
       this.router.navigate(['/admin/faq/view']);
        }
      
      if(data.error) {
        window.scrollTo(0, 0);
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
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.faq = this.service.edit(params['id']).subscribe(res => {
        this.faq = res;
      });
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
}