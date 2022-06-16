import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ModalRegistroComponent } from './modal-registro/modal-registro.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { ListadoComponent } from './listado/listado.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ModalRegistroComponent,
    HomeComponent,
    ListadoComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class HomeModule { }
