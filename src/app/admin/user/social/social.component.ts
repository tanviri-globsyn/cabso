import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {
  user:any;
  userForm:FormGroup;
  constructor(private authService:AuthService, private router:Router,
  private fb:FormBuilder,
  private route: ActivatedRoute,
  public toastr: ToastsManager, vcr: ViewContainerRef)
  { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
     this.createForm();
     
   
 }


  createForm(){
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;

      this.userForm = this.fb.group({
        _id: [this.user._id],
        facebook: [this.user.facebook, Validators.required ],
        twitter:[this.user.twitter, Validators.required],
        instagram:[this.user.instagram, Validators.required],
        linkedin:[this.user.linkedin, Validators.required],
        googleplus:[this.user.googleplus, Validators.required],
     });


    })
  }



  updateUser(user){
 this.route.params.subscribe(params => {
   var id=user._id;
   this.authService.updateEmail(user,id).subscribe(
    data=>{
      this.toastr.success(data.msg);        
      window.scrollTo(0, 0); 
     
    },
    error => {
      this.toastr.error(error.msg);  
    }

   );
   
  });   
}

}