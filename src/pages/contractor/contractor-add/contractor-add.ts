import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ContractorListPage } from '../contractor-list/contractor-list';

/**
* Generated class for the ContractorAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-add',
  templateUrl: 'contractor-add.html',
})
export class ContractorAddPage {
  
  conData:any={};
  conData1:any={};
  today_date:any ={};
  todayDate:any
  contractorData:any =[];
  loading:Loading;
  flag:any='';
  pointValue:any ={};
  saveFlag : boolean = false;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera, public actionSheetController: ActionSheetController, public toastCtrl: ToastController, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public translate:TranslateService) {
    // this.dbService.karigar_id;
  }
  
  ionViewDidLoad() {
    this.getCategory();
    this.getProduct();
  }
  
  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Delete successfully',
      duration: 3000
    });
    toast.present();
  }
  
  
  presentLoading() 
  {
    this.translate.get("Please wait...")
    .subscribe(resp=>{
      this.loading = this.loadingCtrl.create({
        content: resp,
        dismissOnPageChange: false
      });
      this.loading.present();
    })
  }
  
  category:any=[];
  getCategory()
  {
    this.dbService.get_rqst('app_karigar/getCategory')
    .subscribe(d => {
      console.log(d);
      this.category = d.category;
      console.log(this.category);
    });
  }
  
  product_code:any =[]
  
  getProduct(){
    // let id
    // id = val.id
    // console.log(id);
    
    // this.conData1.product_point_group = val.product_point_group;
    this.dbService.post_rqst( {}, 'app_karigar/getProduct?page=').subscribe(r=>{
      console.log(r);
      this.product_code=r['productData'];
      console.log(this.product_code);
    })
  }
  
  
  product_size:any =[]
  
  getSize(val){
    let id
    id = val.id;
    this.conData1.product_name = val.product_name;
    this.dbService.post_rqst( {'product_id':id}, 'app_karigar/coupon_product_size?page=').subscribe(r=>{
      console.log(r);
      this.product_size=r['product_sizes'];
    })
  }
  
  
  
  
  getpoint(point){
    console.log(point);
    // let getData
    // getData = this.product_code.filter( x => x.id==event.value)[0];
    this.pointValue  = point;
    
    console.log(this.pointValue);
    
    
  }
  
  
  
  
  addItem()
  {
    let val=JSON.parse(JSON.stringify(this.conData1));
    console.log(val);
    if(this.conData1.product_point_group!='' && this.conData1.product_detail!='' && this.conData1.qty!='' && this.conData1.totalPoint!=''){
      this.contractorData.push(val);
    }
    console.log(this.contractorData);
    this.conData1.totalPoint='';
    this.conData1.product_point_group='';
    this.conData1.product_detail='';
    this.conData1.qty='';
    this.conData1.totalPoint ='';
    this.pointValue ='';
    
  }
  
  totalPoint(event){
    console.log(event);
    this.conData1.totalPoint =  event * this.pointValue;
    console.log( this.conData1.totalPoint);
    
  }
  
  
  deleteItem(i)
  {
    this.contractorData.splice(i,1);
    this.presentToast();
  }
  
  
  
  onUploadChange(evt: any) {
    // this.flag=false;
    // const file = evt.target.files[0];
    
    // if (file) {
    //   const reader = new FileReader();
    
    //   reader.onload = this.handleReaderLoaded.bind(this);
    //   reader.readAsBinaryString(file);
    // }
    let actionsheet = this.actionSheetController.create({
      title:" Upload File",
      cssClass: 'cs-actionsheet',
      
      buttons:[{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon:'camera',
        handler: () => {
          console.log("Camera Clicked");
          this.takeDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon:'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getDocImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionsheet.present();
}


takeDocPhoto()
{
  console.log("i am in camera function");
  const options: CameraOptions = {
    quality: 90,
    destinationType: this.camera.DestinationType.DATA_URL,
    // allowEdit:true,
    targetWidth : 1050,
    targetHeight : 1000,
    cameraDirection: 1,
    correctOrientation:true,
  }
  
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.conData.image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.conData.image, 'line number 236');
  }, (err) => {
  });
}
getDocImage()
{
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
  }
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.conData.image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.conData.image, 'line number 252');
  }, (err) => {
  });
}

alertToast(msg){
  const toast = this.toastCtrl.create({
    message: msg,
    duration: 3000
  });
  toast.present();
}


submit(){
 
  
  
  if(this.conData.type == 'manual'){
    if(this.contractorData < 1){
      this.alertToast('Please add one item at least!')
      return
    }
  }
  if(this.conData.type == 'image'){
    if(this.conData.image=='' || this.conData.image == undefined){
      this.alertToast('Bill image required')
      return
    }
  }
  
  this.presentLoading();
  this.saveFlag = true;
  this.conData.part = this.contractorData;
  this.conData.contractor_id = this.dbService.karigar_id;

  this.dbService.post_rqst( this.conData,'app_karigar/add_contractor_request ').subscribe( r =>
    {
      console.log(r);

      if(r['status'] == 'SUCCESS'){
        this.loading.dismiss();
        this.navCtrl.popTo(ContractorListPage);
      }
    });
  }
  
  
  
  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
}
