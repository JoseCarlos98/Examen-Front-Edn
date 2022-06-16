import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  cuentasBancarias: any[] = [];
  catalogos: any[] = [];
  editSelected:any;
  sub! : Subscription;

  modeloCatalogo = {
    titulo : 'CATALOGO',
    modelo : 'catalogos'
  }
  modeloCuenta = {
    titulo : 'CUENTA BANCARIA',
    modelo : 'cuentas'
  }

  constructor(
    private apiServices: ApiService
  ) { }

  ngOnInit(): void {
    this.getCuentas();
    this.getCatalogos();
    this.sincronizarTabals();
  }

  sincronizarTabals(){
    this.sub = this.apiServices.refresh$.subscribe( _ =>{
      this.getCatalogos();
      this.getCuentas();
    });
  }

  getCuentas() {
    this.apiServices.getAll('cuentas').subscribe((cuentasBancarias:any) => {
      this.cuentasBancarias = cuentasBancarias;
    })
  }

  getCatalogos() {
    this.apiServices.getAll('catalogos').subscribe((catalogos:any) => {
      this.catalogos = catalogos;
    })
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
      console.log('Observable destruido');
  }

}
