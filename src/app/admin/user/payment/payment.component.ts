import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup,  FormBuilder, FormControl, Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
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
        merchandId: [this.user.merchandId, Validators.required ],
        publicKey:[this.user.publicKey, Validators.required],
        privateKey:[this.user.privateKey, Validators.required],
        BraintreeStatus:[this.user.BraintreeStatus, Validators.required]
      });


    })
  }

  updatePayment(payment){
    if (this.userForm.valid) {
      this.route.params.subscribe(params => {
        var id=payment._id;
        this.authService.updatePayment(payment,id).subscribe(data=>{
          if(data.success) {
            this.toastr.success(data.msg);  
            window.scrollTo(0, 0);
          
           }
          if(data.error) {
            this.toastr.error(data.msg);  
          }
        });
        
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
