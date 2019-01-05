import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import {  Router,ActivatedRoute } from '@angular/router';
import { FormGroup,  FormBuilder,FormControl,  Validators, FormArray, NgForm} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  user:any;
  userForm:FormGroup;
  constructor(private authService:AuthService,
  private fb:FormBuilder,
  private route: ActivatedRoute,
  public toastr: ToastsManager, vcr: ViewContainerRef,
  private router:Router
 ) {  this.toastr.setRootViewContainerRef(vcr);  }

  ngOnInit() {
   this.createForm();

    
  }



  createForm(){
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;

      this.userForm = this.fb.group({
        _id: [this.user._id],
        smptHost: [this.user.smptHost, Validators.required ],
        smtpPort:[this.user.smtpPort, Validators.required],
        smtpUsername:[this.user.smtpUsername, Validators.required],
        smtpPassword:[this.user.smtpPassword, Validators.required],
       
     });


    })
  }

  updateSmtp(user){
    if (this.userForm.valid) {
    this.route.params.subscribe(params => {
      var id=user._id;
      this.authService.updateSMTP(user,id).subscribe(data=>{
        if(data.success) {
          this.toastr.success(data.msg);  
          window.scrollTo(0, 0);
         }
        if(data.error) {
          this.toastr.error(data.msg);  
        }
      });
      
     });   
    } else {
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

