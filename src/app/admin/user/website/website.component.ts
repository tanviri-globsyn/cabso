import { Component, OnInit, ViewContainerRef} from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup,  FormBuilder,FormControl,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {

  user:any;
  userForm:FormGroup;
  minutes:any;
  distance:any;
  maxdistance:any;
  currency_name:any;
  currencySymbol:any;
  constructor(private authService:AuthService, private router:Router,
    private fb:FormBuilder,
    private route: ActivatedRoute,
    public toastr: ToastsManager, vcr: ViewContainerRef) { 
      this.toastr.setRootViewContainerRef(vcr);
     

      this.currency_name = [ { 'name':'AED', 'value':'United Arab Emirates Dirham' }, { 'name':'ALL', 'value':'Albanian Lek' },
      { 'name':'AMD' ,'value':  'Armenian Dram'} , { 'name':'AOA','value':  'Angolan Kwanza'},{'name':'ARS','value':'Argentine Peso'},
       { 'name': 'AUD' ,'value':  'Australian Dollar' },{'name':'AWG','value': 'Aruban Florin'},
       { 'name':'AZN','value': 'Azerbaijani Manat'},{'name':'BAM','value':'Bosnia and Herzegovina Convertible Mark'},
       {'name':'BBD','value':  'Barbadian Dollar'},{'name':'BDT','value':  'Bangladeshi Taka'},{'name':'BGN','value':  'Bulgarian Lev'},
       {'name': 'BHD','value':  'Bahraini Dinar'},{'name':'BIF','value':  'Burundian Franc*'},{'name':'BMD','value': 'Bermudian Dollar'},
       {'name': 'BND','value':  'Brunei Dollar'},{'name':'BOB','value':  'Bolivian Boliviano'},{'name':'BRL','value':  'Brazilian Real'},
        {'name':'BSD','value':  'Bahamian Dollar'},{'name':'BWP','value':  'Botswana Pula'},{'name':'BYN','value':  'Belarusian Ruble'},
        {'name':'BZD','value': 'Belize Dollar'},{'name':'CAD','value': 'Canadian Dollar'},{'name':'CHF','value': 'Swiss Franc'},
        {'name':'CLP', 'value': 'Chilean Peso'},{'name':'CNY','value':'Chinese Renminbi Yuan'},{'name':'COP','value': 'Colombian Peso'},
       {'name': 'CRC','value': 'Costa Rican Colón'},{'name':'CUP','value': 'Cuban Peso'},{'name':'CVE','value': 'Cape Verdean Escudo'}, 
        {'name':'CZK','value': 'Czech Koruna'},{'name': 'DJF','value': 'Djiboutian Franc*'},{'name':'DKK','value': 'Danish Krone'},
        { 'name': 'DOP','value': 'Dominican Peso'},{ 'name':'DZD','value': 'Algerian Dinar'},{ 'name':'EGP','value': 'Egyptian Pound'},
        { 'name':'ERN','value': 'Eritrean Nakfa'},{ 'name':'ETB','value': 'Ethiopian Birr'},{ 'name': 'EUR','value': 'Euro'},
        { 'name':'FJD','value': 'Fijian Dollar'},{ 'name':'FKP','value': 'Falkland Pound'},{ 'name':'GBP','value': 'British Pound'},
        { 'name': 'GEL','value': 'Georgian Lari'},{ 'name':'GHS','value': 'Ghanaian Cedi'},{ 'name':'GIP','value': 'Gibraltar Pound'},
        { 'name': 'GMD','value': 'Gambian Dalasi'},{ 'name':'GNF','value': 'Guinean Franc*'},{ 'name':'GTQ','value': 'Guatemalan Quetzal'},
        { 'name':'GYD','value': 'Guyanese Dollar'},{ 'name': 'HKD','value': 'Hong Kong Dollar'},{ 'name':'HNL','value':'Honduran Lempira'},
        { 'name':'HRK','value':'Croatian Kuna'},{ 'name':'HTG','value':'Haitian Gourde'},{ 'name': 'HUF','value': 'Hungarian Forint'},
        { 'name':'IDR','value':'Indonesian Rupiah'},{ 'name': 'ILS','value': 'Israeli New Sheqel'},{ 'name':'INR','value':'Indian Rupee'},
        { 'name':'IRR','value':'Iranian Rial'},{ 'name':'ISK','value':'Icelandic Króna'},{ 'name':'JMD','value':'Jamaican Dollar'}, 
        { 'name':'JPY','value': 'Japanese Yen'},{ 'name':'KES','value':'Kenyan Shilling'},{ 'name':'KGS','value':'Kyrgyzstani Som'},           
        { 'name': 'KHR','value':'Cambodian Riel'}, { 'name': 'KMF','value':'Comorian Franc*'}, { 'name': 'KRW','value':'South Korean Won*'},
        { 'name': 'KYD','value':'Cayman Islands Dollar'}, { 'name': 'KZT','value':'Kazakhstani Tenge'}, { 'name': 'LAK','value':'Lao Kip*'},
        { 'name': 'LBP','value':'Lebanese Lira'}, { 'name': 'LKR','value':'Sri Lankan Rupee'}, { 'name': 'LRD','value':'Liberian Dollar'},
        { 'name': 'LSL','value':'Lesotho Loti'}, { 'name': 'MAD','value':'Moroccan Dirham'}, { 'name': 'MDL','value':'Moldovan Leu'},
        { 'name':  'MKD','value':'Macedonian Denar'}, { 'name': 'MMK','value':'Myanmar Kyat'}, { 'name': 'MNT','value':'Mongolian Tögrög'},
        { 'name': 'MOP','value':'Macanese Pataca'}, { 'name':'MUR','value':'Mauritian Rupee'}, { 'name':'MVR','value':'Maldivian Rufiyaa'},
        { 'name':'MWK','value':'Malawian Kwacha'}, { 'name':'MXN','value':'Mexican Peso'}, { 'name': 'MYR','value': 'Malaysian Ringgit'}, 
        { 'name':'NOK','value': 'Norwegian Krone'}, { 'name': 'NZD','value': 'New Zealand Dollar'}, { 'name': 'PHP','value': 'Philippine Peso'}, 
        { 'name': 'PLN','value': 'Polish Zloty'}, { 'name':  'RUB','value': 'Russian Ruble'},  { 'name': 'SGD','value': 'Singapore Dollar'}, { 'name': 'SEK','value': 'Swedish Krona'},
       { 'name': 'TWD','value':'Taiwan New Dollar'},{'name':'THB','value': 'Thai Baht'},{'name':'TRY','value': 'Turkish Lira'},{'name':'USD','value': 'U.S. Dollar'} ]
    
       this.currencySymbol =[ { 'name':'AED', 'value':'د.إ' }, { 'name':'ALL', 'value':'L' },{ 'name':'AMD','value':'Դ'},
      { 'name':'AOA', 'value':'Kz'},{ 'name':'ARS', 'value':'$'},{ 'name':'AUD' , 'value': '$'},{ 'name':'AWG', 'value':'ƒ'},{ 'name':'AZN', 'value':'ман'},
      { 'name':'BAM', 'value':'КМ'},{ 'name':'BBD', 'value':'$'},{ 'name':'BDT', 'value':'৳'},{ 'name':'BGN', 'value':'лв'},{ 'name':'BHD', 'value':'ب.د'},
      { 'name':'BIF', 'value':'₣'},{ 'name':'BMD', 'value':'$'},{ 'name':'BND', 'value':'$'},{ 'name':'BOB', 'value':'Bs.'},{ 'name':'BRL' , 'value': 'R$'},
      { 'name':'BSD', 'value':'$'},{ 'name':'BWP', 'value':'P'},{ 'name':'BYN', 'value':'Br'},{ 'name':'BZD', 'value':'$'},{ 'name': 'CAD' , 'value': '$'},
      { 'name': 'CHF', 'value':'₣'},{ 'name':'CLP', 'value':'$'},{ 'name':'CNY', 'value':'¥'},{ 'name':'COP', 'value':'$'},{ 'name':'CRC', 'value':'₡'},
      { 'name':'CUP', 'value':'$'},{ 'name':'CVE', 'value':'$'},{ 'name':'CZK' , 'value': ' Kč'},{ 'name':'DJF', 'value':'₣'},{ 'name': 'DKK' , 'value': 'kr.'},
      { 'name':'DOP' , 'value': '$'},{ 'name':'DZD'  , 'value': 'د.ج'},{ 'name':'EGP' , 'value': '£'},{ 'name':'ERN'  , 'value':'Nfk'},{ 'name':'ETB', 'value':'ብር'},
      { 'name': 'EUR' , 'value': '€'},{ 'name':'FJD' , 'value': '$'},{ 'name':'FKP' , 'value': '£'},{ 'name':'GBP' , 'value': '£'},{ 'name':'GEL' , 'value': 'ლ'},
      { 'name':'GHS' , 'value': '₵'},{ 'name':'GIP' , 'value': '£'},{ 'name':'GMD' , 'value': 'D'},{ 'name':'GNF' , 'value': '₣'},{ 'name':'GTQ' , 'value': 'Q'},
      { 'name':'GYD' , 'value': '$'},{ 'name': 'HKD' , 'value': '$'},{ 'name':'HNL', 'value':'L'},{ 'name':'HRK', 'value':'Kn'},{ 'name':'HTG', 'value':'G'},
      { 'name':'HUF' , 'value': 'Ft'},{ 'name': 'IDR', 'value':'Rp'},{ 'name':'ILS' , 'value': '₪'},{ 'name':'INR', 'value':'₨'},{ 'name':'IRR', 'value':'﷼'},
      { 'name':'ISK', 'value':'Kr'},{ 'name':'JMD', 'value':'$'},{ 'name':'JPY' , 'value': '¥'},{ 'name':'KES', 'value':'Sh'},{ 'name':'KGS', 'value':'som'},
      { 'name':'KHR', 'value':'៛'},{ 'name':'KMF', 'value':'francs'},{ 'name':'KRW', 'value':'₩'},{ 'name':'KYD', 'value':'$'},{ 'name':'KZT', 'value':'〒'},
      { 'name':'LAK', 'value':'₭'},{ 'name':'LBP', 'value':'ل.ل'},{ 'name':'LKR', 'value':'Rs'},{ 'name':'LRD', 'value':'$'},{ 'name':'LSL', 'value':'L'},
      { 'name':'MAD', 'value':'د.م.'},{ 'name':'MDL', 'value':'L'},{ 'name':'MKD', 'value':'ден'},{ 'name':'MMK', 'value':'K'},{ 'name':'MNT', 'value':'₮'},
      { 'name':'MOP', 'value':'P'},{ 'name':'MUR', 'value':'₨'},{ 'name':'MVR', 'value':'  ރ.'},{ 'name':'MWK', 'value':'MK'},{ 'name':'MXN', 'value':'Mex$'},
      { 'name':  'MYR' , 'value': 'RM'},{ 'name': 'NOK' , 'value': 'kr'},{ 'name': 'NZD' , 'value': '$'},{ 'name': 'PHP' , 'value': '₱'},{ 'name': 'PLN' , 'value': 'zÅ‚'},
      { 'name': 'GBP' , 'value': '£'},{ 'name': 'RUB' , 'value': 'руб'},{ 'name': 'SGD' , 'value': 'S$'},{ 'name': 'SEK' , 'value': 'kr'},{ 'name': 'CHF' , 'value': 'SFr.'},
      { 'name': 'TWD' , 'value': '$'},{ 'name': 'THB' , 'value': '฿'},{ 'name': 'TRY' , 'value': 'TL'},{ 'name': 'USD' , 'value': '$'} ];

          
     }

  ngOnInit() {
    this.createForm();
  }

   getCurrencySymbol(name){
    return  this.currencySymbol.filter(x => x.name === name);
  }
  createForm(){
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;

      this.userForm = this.fb.group({
        _id: [this.user._id],
        username: [this.user.username, Validators.compose([Validators.required, Validators.email])],
        email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
        footer:[this.user.footer, Validators.required],
        apptitle:[this.user.apptitle, Validators.compose([Validators.required, Validators.minLength(3)])],
        appcontent:[this.user.appcontent, Validators.compose([Validators.required, Validators.minLength(3)])],
        phone:[this.user.phone, Validators.compose([Validators.required])],       
        distancePerCab:[this.user.distancePerCab, Validators.compose([Validators.required])],       
        tax:[this.user.tax, Validators.compose([Validators.required])],  
        inspectionon:[this.user.inspectionon, Validators.compose([Validators.required])],       
        maxDistance:[this.user.maxDistance, Validators.compose([Validators.required])],       
        currencyCode:[this.user.currencyCode,Validators.required ],      
        siteName:[this.user.siteName,Validators.required ],  
        emergencyContact:[this.user.emergencyContact,Validators.required ],  
        FCMUserKey:[this.user.FCMUserKey,Validators.required ],  
        FCMDriverKey:[this.user.FCMDriverKey,Validators.required ],  
        googleMapKey:[this.user.googleMapKey,Validators.required ], 
        helppagesheader:[this.user.helppagesheader,Validators.required ],
        maxdisperride:[this.user.maxdisperride,Validators.required ],
     });


    })
  }



  updateSetting(user){
    if (this.userForm.valid) {
     
      this.route.params.subscribe(params => {
        var currency = this.getCurrencySymbol(user.currencyCode);
        var id=user._id;
        var symbol=currency[0].value;
        this.authService.updateSetting(user,id,symbol).subscribe(
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
    else
    {
      this.validateAllFormFields(this.userForm);
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
