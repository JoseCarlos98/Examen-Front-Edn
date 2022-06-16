import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import swal from "sweetalert2";
import Swal from 'sweetalert2';

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
      
      this.closeResult = `Closed with: ${result}`;
      if (result) {
        if (this.editarData && this.borrarEditado) {
          this.apiServices.delete(this.modeloYTitulo.modelo, this.editarData.id)
          .subscribe( _ => { 
            Swal.fire('Eliminado con exito'); this.borrarEditado = false 
            this.editarData = null;
          })

        } else if (this.editarData) {
          this.apiServices.editar(this.modeloYTitulo.modelo, this.modeloYTitulo.modelo == 'catalogos' ? catalogo : cuenta, this.editarData.id)
          .subscribe( _ => { 
            Swal.fire('Actualizado con exito');
            this.editarData = null;
          })
        
        } else {
          this.apiServices.registro(this.modeloYTitulo.modelo, this.modeloYTitulo.modelo == 'catalogos' ? catalogo : cuenta)
          .subscribe( _ => { 
            Swal.fire('Creado con exito')
            this.editarData = null;
          }) 
        }
      }
    },(reason) => this.closeResult = `Dismissed ${this.getDismissReason(reason)}`);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
      else if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
       else return `with: ${reason}`;
  }



}
