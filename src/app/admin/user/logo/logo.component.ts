import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FileValidator } from '../../../provider/file-input.validator'
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {
  user: any;
  Form: FormGroup;
  logo: File;
  url: any;
  constructor(private service: AuthService, private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private elem: ElementRef,
    public toastr: ToastsManager, vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.url = environment.apiUrl;
    this.createForm();

    this.service.getUserinfo().subscribe(res => {
      this.user = res.user;

    });
  }


  createForm() {
    this.Form = new FormGroup({
      logo: new FormControl("", [FileValidator.validate])
    });

  }


  addLogo(Form) {
    if (this.Form.valid) {
      this.route.params.subscribe(params => {
        let files = this.elem.nativeElement.querySelector('#logo').files;
        if (!this.validateFile(files[0].name)) {
          this.toastr.error('Support File Format - png,jpeg,jpg ', 'Error!');

        } else {
          let formData = new FormData();
          let file = files[0];
          formData.append('logo', file, file.name);
          this.service.updateLogo(formData, params['id']).subscribe(data => {
            if (data.success) {
              this.toastr.success(data.msg);
              this.service.getUserinfo().subscribe(res => {
                this.user = res.user;

              });
              this.router.navigate(['admin/user/logo/' + params['id']]);
              window.scrollTo(0, 0);
            }

            if (data.error) {
              this.toastr.error(data.msg);
            }
          });
        }

      });
    }
    else {
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


  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png') {
      return true;
    }
    else if (ext.toLowerCase() == 'jpeg') {
      return true;
    } else if (ext.toLowerCase() == 'jpg') {
      return true;
    } else {
      return false;
    }
  }

}
