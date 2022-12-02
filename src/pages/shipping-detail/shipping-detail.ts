import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, App, ModalController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TabsPage } from '../tabs/tabs';
// import { InAppBrowser } from '@ionic-native/in-app-browser'
import { ConstantProvider } from '../../providers/constant/constant';
import { FeedbackPage } from '../feedback/feedback';
import { ReceiveRemarkModalPage } from '../receive-remark-modal/receive-remark-modal';

@IonicPage()
@Component({
  selector: 'page-shipping-detail',
  templateUrl: 'shipping-detail.html',
})
export class ShippingDetailPage {
  karigar_gift_id:any='';
  shipped_detail:any={};
  gift_detail:any={};
  gift_id:any='';
  redeem_type:any ='';
  loading:Loading;
  receive_status:any='';
  karigar_gift:any={};
  edit:any='';
  giftimg:any=[];
  upload_url:any='';
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public service:DbserviceProvider,
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    private app: App,
    public modalCtrl: ModalController,
    public con: ConstantProvider,
    public constn:ConstantProvider) {
      
      this.upload_url = this.con.upload_url;
      
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ShippingDetailPage');
      this.upload_url = this.constn.upload_url;
      this.karigar_gift_id = this.navParams.get('id');
      this.gift_id = this.navParams.get('gift_id');
      this.redeem_type = this.navParams.get('redeem_type');
      
      console.log( this.redeem_type);
      
      this.getShippedDetail();
      this.getGiftDetail();
      this.presentLoading();
      
    }
    getShippedDetail()
    {
      this.service.post_rqst({'karigar_gift_id' :this.karigar_gift_id},'app_karigar/shippedDetail').subscribe( r =>
        {
          console.log(r);
          if(r['shipped'])
          this.shipped_detail=r['shipped'];
        });
      }
      presentLoading() 
      {
        this.loading = this.loadingCtrl.create({
          content: "Please wait...",
          dismissOnPageChange: false
        });
        this.loading.present();
      }
      getGiftDetail()
      {
        console.log();
        this.service.post_rqst({'id' :this.karigar_gift_id,'gift_id':this.gift_id,'karigar_id':this.service.karigar_id },'app_karigar/giftDetail').subscribe( r =>
          {
            console.log(r);
            this.loading.dismiss();
            this.gift_detail=r['gift'];
            this.giftimg=r['gift_images'];
            this.karigar_gift=r['karigar_gift']
            if(r['karigar_gift'] != null)
            {
              this.receive_status=r['karigar_gift'].receive_status;
            }
            console.log(this.receive_status);
            // this.karigar_gift.gift_points = parseInt( this.gift_detail.gift_points );
            console.log(this.gift_detail);

          });
        }
        // recvConfirmation(gift_id, redeem_type)
        // {
        //   let alert=this.alertCtrl.create({
        //     title:'Confirmation!',
        //     subTitle: 'Did you receive this ' + redeem_type + ' ?' ,
        //     cssClass:'action-close',
            
        //     buttons: [{
        //       text: 'No',
        //       role: 'cancel',
        //       handler: () => {
        //         console.log('Cancel clicked');
        //       }
        //     },
        //     {
        //       text:'Yes',
        //       cssClass: 'close-action-sheet',
        //       handler:()=>
        //       {
        //         console.log(gift_id);
        //         this.service.post_rqst({'id':this.karigar_gift.id,'karigar_id':this.service.karigar_id},'app_karigar/redeemReceiveStatus').subscribe(r=>
        //           {
        //             console.log(r);
        //             this.showSuccess('You have receive ' + redeem_type  + ' successfully')
        //             // this.navCtrl.setRoot(TabsPage,{index:'3'});
        //             this.navCtrl.push(TabsPage);
        //           });
        //         }
        //       }]
        //     });
        //     alert.present();
            
        //   }
          
          recvConfirmation(gift_id,redeem_type)
          {
            console.log(gift_id);
            
            let ReceiveModal = this.modalCtrl.create(ReceiveRemarkModalPage,{'gift_id':gift_id,'redeem_type':redeem_type});
            ReceiveModal.present();
          }
          showSuccess(text)
          {
            let alert = this.alertCtrl.create({
              title:'Success!',
              cssClass:'action-close',
              subTitle: text,
              buttons: ['OK']
            });
            alert.present();
          }
          
          ionViewDidLeave() {
            
            let nav = this.app.getActiveNav();
            
            if(nav && nav.getActive()) {
              
              let activeView = nav.getActive().name;
              
              let previuosView = '';
              if(nav.getPrevious() && nav.getPrevious().name) {
                previuosView = nav.getPrevious().name;
              }
              
              console.log(previuosView);
              
              console.log(activeView);
              console.log('its leaving');
              
              if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage')) {
                
                console.log(previuosView);
                this.navCtrl.popToRoot();
              }
            }
            
          }
          
          goto_link(url)
          {
            console.log(url);
            
            //  this.InAppBrowser.create(url);
          }
          
          editAddress()
          {
            this.service.post_rqst({'id': this.karigar_gift.id,'shipping_address':this.karigar_gift.shipping_address},'app_karigar/editAddress').subscribe(result=>
              {
                if(result['status']='SUCCESS')
                this.edit='';
                
                
                this.showSuccess("Shipping Address Updated !");
                this.getGiftDetail();
                
              })
            }
            
            openChat(){
              this.navCtrl.push(FeedbackPage)
            }
            
          }
          