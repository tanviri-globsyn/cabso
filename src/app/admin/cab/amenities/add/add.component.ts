import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AmenitiesService } from '../../../../service/amenities.service';
import { Observable } from 'rxjs/Observable';
import { FileValidator } from '../../../../provider/file-input.validator'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  Form: FormGroup;
  image: File;
  constructor(private service: AmenitiesService,
    private fb: FormBuilder,
    private elem: ElementRef,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.Form = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      //  image: ['',FileValidator.validate],
    });
  }
  add(form) {
    if (this.Form.valid) {


      this.service.add(form).subscribe(data => {
        if (data.success) {
          sessionStorage.setItem("SuccessMessage", data.msg);
          this.router.navigate(['admin/amenities/view']);
          window.scrollTo(0, 0);
        }

        if (data.error) {
          this.toastr.error(data.msg);
          window.scrollTo(0, 0);

        }
      }

      );

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
