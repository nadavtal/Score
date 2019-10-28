import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IonToastService } from '../../services/ion-toast.service';

@Component({
  selector: 'app-ion-toast',
  templateUrl: './ion-toast.component.html',
  styleUrls: ['./ion-toast.component.scss'],
})
export class IonToastComponent implements OnInit {
  toastSettings: any;

  constructor(public toastController: ToastController,
              public ionToastService: IonToastService
              ) {}

  ngOnInit() {
    this.ionToastService.ionToastSubject.subscribe((toastSettings: any) => {
      this.toastSettings = toastSettings;
      if (toastSettings.type && toastSettings.type === 'options') {
        this.presentToastWithOptions();
      } else {
        this.presentToast();

      }
    });
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: this.toastSettings.message,
      duration: this.toastSettings.duration ? this.toastSettings.duration : 1500,
      color: this.toastSettings.color ? this.toastSettings.color : 'dark',
      position: this.toastSettings.position ? this.toastSettings.position : 'bottom'
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      position: this.toastSettings.position ? this.toastSettings.position : 'bottom',
      color: this.toastSettings.color ? this.toastSettings.color : 'dark',
      buttons: [
        {
          side: 'start',
          icon: this.toastSettings.icon ? this.toastSettings.icon : '',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}


