import { Component, OnInit, ViewContainerRef} from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { FormGroup,  FormBuilder, FormControl, Validators,FormArray, NgForm, FormsModule,
   ReactiveFormsModule } from '@angular/forms';
   import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:String;
  password:String;
  form:FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
   private fb:FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef) 
    { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.form = this.fb.group({
     username: ['', Validators.compose([Validators.required, Validators.email]) ],
    // username: ['', Validators.required ],
      password: ['', Validators.required ]
   });
   console.log(this.route.component);         

  }

  onLoginSubmit(login) {
    if (this.form.valid) {
    const user = {
      username: login.username,
      password: login.password,
    }

    this.authService.authenticateUser(user).subscribe(data => {
        if(data.success) {
          this.authService.storeUserData(data.token, data.user);
         
          this.router.navigate(['admin/dashboard']);
        } else {
          this.toastr.error(data.msg);  
           this.router.navigate(['login']);
        }
    });

  }
  else
  {
    this.validateAllFormFields(this.form);
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
