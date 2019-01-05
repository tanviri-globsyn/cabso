import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { PageService } from './../../service/page.service';
import { FormGroup,  FormBuilder,FormControl, Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from './../../service/auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FaqService } from './../../service/faq.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  pages: any;
  userForm:FormGroup;
  user:any;
  count:any;
  faqCount:any;
  constructor(private pageservice:PageService,
    private authService:AuthService,
  private fb:FormBuilder,
  private route: ActivatedRoute,
  public toastr: ToastsManager, vcr: ViewContainerRef,
  private faq:FaqService,
    private router: Router, private http: HttpClient,) 
  { this.toastr.setRootViewContainerRef(vcr);
     this.createForm(); }

  ngOnInit() {
     this.pageservice.getUserPage().subscribe(res => {
      this.pages =  res;
    }); 
    this.authService.getUserinfo().subscribe(res => {
      this.user = res.user;
    
   });

   this.pageservice.getuserHelpCount().subscribe(res => {
    this.count = res;
  
  });


  this.faq.getCount().subscribe(res => {
    this.faqCount = res;
  });
  }
  sendMail(form){  
    if (this.userForm.valid) {
     this.authService.sendMail(form).subscribe(data=>{
     
      if(data.success) {
        this.toastr.success(data.msg, 'Success!');  
        this.userForm.reset();
        window.scrollTo(0, 0);
       }
      if(data.error) {
        this.toastr.error(data.msg, 'Error!');
        window.scrollTo(0, 0);
      }
    });
  }
  else
  {
    this.validateAllFormFields(this.userForm);
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
createForm(){
      this.userForm = this.fb.group({
        name: ['', Validators.required ],
        email:['', Validators.compose([Validators.required, Validators.email])],
        subject:['',Validators.required],
        message:['',Validators.required],
   });
    
  }
}
