import { Component, OnInit,ElementRef,ViewContainerRef } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../../../service/category.service';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FileValidator} from '../../../../provider/file-input.validator'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  category:any;
  Form:FormGroup;
  types:any;
  facility:any;
  amenities:any;
  data:any;
  constructor(private service: CategoryService,
    private fb:FormBuilder,
    private elem: ElementRef,
    private router: Router,
    public toastr: ToastsManager, vcr: ViewContainerRef,private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = this.service.edit(params['id']).subscribe(res => {
        this.category = res;
      });
    });

    this.service.getBodyType().subscribe(res => {
      this.types = res;

    });

    this.service.getAmenities().subscribe(res => {
      this.facility = res;
     
    });


    this.createForm();
  }
  createForm(){
    this.Form = this.fb.group({
      category_name: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(30)])],
      bodytypes:[''],
      amenities:[''],
      unitprice:[''],
      baseprice:[''],
 });
}

update(form){
  this.route.params.subscribe(params => {
    this.service.update(form, params['id']).subscribe(data=>{  
      if(data.success) {
      sessionStorage.setItem("SuccessMessage", data.msg);  
      this.router.navigate(['admin/category/view']);
      window.scrollTo(0, 0);
      }
    
    if(data.error) {
      this.toastr.error(data.msg); 
      }
    });

  });
}

}
