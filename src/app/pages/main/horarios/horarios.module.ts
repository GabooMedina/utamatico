import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorariosPageRoutingModule } from './horarios-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HorariosPage } from './horarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorariosPageRoutingModule,
    SharedModule
  ],
  declarations: [HorariosPage]
})
export class HorariosPageModule {}
