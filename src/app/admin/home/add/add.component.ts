import { Component, OnInit, ElementRef,ViewContainerRef} from '@angular/core';
import { FormGroup,NG_VALIDATORS,  FormBuilder, FormControl, Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HomeService} from '../../../service/home.service';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {FileValidator} from '../../../provider/file-input.validator'


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  Form:FormGroup;
  image:File;
  pages:any;
  constructor(private fileUploader: HomeService,
    private fb:FormBuilder,
    private elem: ElementRef,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef
) {  this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.Form = this.fb.group({
      title: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(30)])],
      content:['', Validators.required],
      image: ['',FileValidator.validate],
 });
  
}

getContent() {
  this.fileUploader.getContent().subscribe(res => {
    this.pages = res;
  });
}


addPage(form) {
   
  if (this.Form.valid) {
    let files = this.elem.nativeElement.querySelector('#image').files;
    if (!this.validateFile(files[0].name)) {
      this.toastr.error('Support File Format - png,jpeg,jpg ');  
     
    } else { 

    let formData = new FormData();
    let file = files[0];
      formData.append('image', file, file.name);
       formData.append('title',  form.title);
       formData.append('content',  form.content);
      this.fileUploader.uploadImage(formData).subscribe(data=>{
      if(data.success) {
        sessionStorage.setItem("SuccessMessage", data.msg);  
        this.getContent();
        window.scrollTo(0, 0);
         this.router.navigate(['admin/home/view']);
       
         }
        if(data.error) {
          this.toastr.error(data.msg);  
          window.scrollTo(0, 0);
        }
      });
    
  }
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

validateFile(name: String) {
  var ext = name.substring(name.lastIndexOf('.') + 1);
  if (ext.toLowerCase() == 'png') {
      return true;
  }
  else if (ext.toLowerCase() == 'jpeg'){
    return true;
  } else if (ext.toLowerCase() == 'jpg'){
    return true;
  } else {
      return false;
  }
}




}
