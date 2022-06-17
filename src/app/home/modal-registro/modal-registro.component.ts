import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.component.html',
  styleUrls: ['./modal-registro.component.scss']
})
export class ModalRegistroComponent implements OnInit {

  @Input() editarData : any = null
  @Input() modeloYTitulo : any
  @Input() cuentaOrCatalogo :any

  closeResult: string = '';
  borrarEditado: boolean = false;

  addForm = this.fb.group({
    alias  :  new FormControl({ value: null, disabled: false }, Validators.required),
    id_banco  : new FormControl({ value: '0', disabled: false }, Validators.required),
    ultimos_digitos: new FormControl({ value: null, disabled: false }, Validators.required),
    
    clave  :  new FormControl({ value: null, disabled: false }, Validators.required),
    nombre_corto  :  new FormControl({ value: null, disabled: false }, Validators.required),
    banco  :  new FormControl({ value: null, disabled: false }, Validators.required),
    id_status  :  new FormControl({ value: null, disabled: false }, Validators.required),
    orden  :  new FormControl({ value: null, disabled: false }, Validators.required),
  });

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private apiServices: ApiService
  ) {}

  ngOnInit(): void { }

  open(content?:any) {
    if (this.editarData) this.addForm.patchValue(this.editarData)
      else this.addForm.reset({id_banco: '0'});

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      const cuenta = {
        alias           : this.addForm.get('alias')!.value,
        id_banco        : this.addForm.get('id_banco')!.value,
        ultimos_digitos : this.addForm.get('ultimos_digitos')!.value,
      }
     
      const catalogo = {
        clave         : this.addForm.get('clave')!.value,
        nombre_corto  : this.addForm.get('nombre_corto')!.value,
        banco         : this.addForm.get('banco')!.value,
        id_status     : 1, 
        orden         : this.addForm.get('orden')!.value,
      }
      
      if (result) {
        if (this.editarData && this.borrarEditado) {
          this.apiServices.delete(this.modeloYTitulo.modelo, this.editarData.id)
          .subscribe( _ => this.alerta('', true))

        } else if (this.editarData) {
          this.apiServices.editar(this.modeloYTitulo.modelo, this.modeloYTitulo.modelo == 'catalogos' ? catalogo : cuenta, this.editarData.id)
          .subscribe( resp => {
            if (resp === true) this.alerta('Actualizado con exito!')
            else swal.fire('Error', resp, 'error')
          })
          
        } else {
          this.apiServices.registro(this.modeloYTitulo.modelo, this.modeloYTitulo.modelo == 'catalogos' ? catalogo : cuenta)
          .subscribe( resp => {
            if (resp === true) this.alerta('Creado con exito!')
              else swal.fire('Error', resp, 'error')
          }) 
        }
      }
    })
  }

  alerta(mensaje?:string, borrar?:boolean){
    if (borrar) {
      this.borrarEditado = false;
      Swal.fire({
        title: `Estas seguro de eliminar ${this.editarData?.alias || this.editarData.banco}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
      }).then((result) => { if (result.isConfirmed) Swal.fire(`${this.editarData?.alias || this.editarData.banco} eliminado!`)}) ;

    } else {
      Swal.fire(mensaje);
      this.editarData = null;
    }
  }
}
