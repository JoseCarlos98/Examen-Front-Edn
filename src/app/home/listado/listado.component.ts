import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  @Input() cuentaOCatalogo : any
  @Input() catalogos : any
  @Input() modeloYTitulo! : any
  
  editatSeleccionado: any;
  edit: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  editarCuenta(cuenta:any){
    this.edit = !this.edit;
    if (this.edit) {
      let data:any = {
        ...cuenta,
        modelo: cuenta.alias ? 'Cuentas' : 'Catalogos'
      }

      this.editatSeleccionado = data;
    }
    else this.editatSeleccionado = null;
  }
}


