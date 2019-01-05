import { Component, OnInit, ElementRef,ViewChild,ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService} from '../../../service/home.service';
import { FormGroup,  FormBuilder,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Location} from '@angular/common';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {FileValidator} from '../../../provider/file-input.validator'
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  @ViewChild('image') image;
  page: any;
  Form: FormGroup;
  url:any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: HomeService,
    private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private elem: ElementRef,private _location: Location) 
    { this.toastr.setRootViewContainerRef(vcr);
       this.createForm(); }

  createForm(){
    this.Form = this.fb.group({
      title: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(30)])],
      content:['', Validators.required],
      image: [''],
 });

 }

 ngOnInit() {
  this.url=environment.apiUrl;
  this.route.params.subscribe(params => {
    this.page = this.service.editPage(params['id']).subscribe(res => {
      this.page = res;
    });
  });
}




updatePageImage(Form) {
  this.route.params.subscribe(params => {
     let files = this.elem.nativeElement.querySelector('#image').files;
    
     if (files && files.length > 0) {
    if (!this.validateFile(files[0].name)) {
      this.toastr.error('Support File Format - png,jpeg,jpg ');  
     
    } else { 
        let formData = new FormData();
          let file = files[0];
          formData.append('image', file, file.name);
          formData.append('title',  Form.title);
          formData.append('content',  Form.content);
         this.service.updatePageImage(formData,params['id']).subscribe(
          data=>{ 
            if(data.success) {
              sessionStorage.setItem("SuccessMessage", data.msg);
            // this.getContent();
            window.scrollTo(0, 0);
             this.router.navigate(['admin/home/driver']);
            }
          
          if(data.error) {
            this.toastr.error(data.msg);  
             
            }
          })
         
        
  }
}
  else
  {
    this.service.updatePage(Form, params['id']).subscribe(data=>{ 
      if(data.success) {
        sessionStorage.setItem("SuccessMessage", data.msg);
     //  this.getContent();
     window.scrollTo(0, 0);
     this.router.navigate(['/admin/home/driver']);
      }
    
    if(data.error) {
      this.toastr.error(data.msg, 'Error!');  
       
      }
    });

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

