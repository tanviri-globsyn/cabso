import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup,  FormBuilder,FormControl,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  user:any;
  userForm:FormGroup;
  constructor(private authService:AuthService, private router:Router,
    private fb:FormBuilder,
    private route: ActivatedRoute,
    public toastr: ToastsManager, vcr: ViewContainerRef) 
    {this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {

    this.userForm = this.fb.group({
      password:['', Validators.required],
      newPassword:['',Validators.compose([Validators.required, Validators.minLength(6)])],
 });
  }

  
  updatePassword(userForm){
    if (this.userForm.valid) {
    this.route.params.subscribe(params => {
      this.authService.ChangePassword(userForm,params['id']).subscribe( data=>{ 
        if(data.success) {
          this.toastr.success(data.msg, 'Success!'); 
        }
      
      if(data.error) {
        this.toastr.error(data.msg, 'Error!');  
         
        }
      }

    
       );
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

}
