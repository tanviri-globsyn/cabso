import { Component, OnInit, ElementRef,ViewChild,ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerService} from '../../../service/banner.service';
import { FormGroup,  FormBuilder,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild('image') image;
  page: any;
  Form: FormGroup;
  banners:any;
  url:any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: BannerService,
    private fb: FormBuilder,
    private elem: ElementRef,
    public toastr: ToastsManager, vcr: ViewContainerRef) 
    {  this.createForm();
      this.toastr.setRootViewContainerRef(vcr);
     }

    createForm(){
      this.Form = this.fb.group({
        title: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(60)])],
        image: ['']
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


  updateBanner(Form) {
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
           this.service.updatePageImage(formData,params['id']).subscribe(   data=>{ 
            if(data.success) {
              sessionStorage.setItem("SuccessMessage", data.msg);
             this.getContent();
             this.router.navigate(['admin/banner/view']);
            }
          
          if(data.error) {
            this.toastr.error(data.msg, 'Error!');  
             
            }
          });
        }  
    }
    else
    {

     
      this.service.updatePage(Form, params['id']).subscribe(data=>{ 
        if(data.success) {
          sessionStorage.setItem("SuccessMessage", data.msg);
         this.getContent();
         this.router.navigate(['admin/banner/view']);
         window.scrollTo(0, 0);
        }
      
      if(data.error) {
        this.toastr.error(data.msg);  
        window.scrollTo(0, 0);
        }
      });
     
    }
  });
  }


  getContent() {
    this.service.getContent().subscribe(res => {
      this.banners = res;
      if(this.banners.length==0){
        this.router.navigate(['admin/banner/add']);
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
