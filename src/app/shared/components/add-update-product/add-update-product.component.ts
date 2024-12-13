import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AcademicService } from 'src/app/services/academic.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() task: any;  // Cambio de product a task

  utilsSrv = inject(UtilsService);
  academicService = inject(AcademicService);  // Inyectamos el servicio de tareas

  form = new FormGroup({
    id: new FormControl(''),
    titulo: new FormControl('', [Validators.required, Validators.minLength(4)]),  // Cambié de name a titulo
    descripcion: new FormControl('', [Validators.required, Validators.minLength(2)]),  // Descripción de la tarea
    date: new FormControl('', [Validators.required]),  // Fecha de vencimiento
  });

  user = {} as User;

  constructor() { }

  ngOnInit() {
    this.user = this.utilsSrv.getFromLocalStorage('user');
    if (this.task) {
      this.form.setValue({
        id: this.task.id,
        titulo: this.task.titulo,
        descripcion: this.task.descripcion,
        date: this.task.date
      });  // Inicializamos el formulario con los valores de la tarea si existe
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.task) {
        this.updateTask();  // Llama a la función de actualizar tarea
      } else {
        this.createTask();  // Llama a la función de crear tarea
      }
    } else {
      this.utilsSrv.showToast({
        message: 'Por favor, complete todos los campos',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }
  }

  // ======== Crear Tarea =======
  async createTask() {
    const loading = await this.utilsSrv.loading();
    await loading.present();

    const newTask: any = {
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion,
      date: this.form.value.date,
      status: 'pendiente'  // Asignamos un estado por defecto a la tarea
    };

    this.academicService.addTask(newTask).then(async () => {
      this.utilsSrv.dismissModal({ success: true });

      this.utilsSrv.showToast({
        message: 'Tarea Entregada Exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

       // Luego, después de 5 segundos, mostrar el mensaje de advertencia
    setTimeout(() => {
      this.utilsSrv.showToast({
        message: 'Tu entrega ha sido Calificada',
        duration: 15000,
        color: 'warning',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }, 5000); // Retraso de 5 segundos

    }).catch(error => {
      console.log(error);

      this.utilsSrv.showToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  // ========= Actualizar Tarea =========
  private async updateTask() {
    const loading = await this.utilsSrv.loading();
    await loading.present();

    const updatedTask: any = {
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion,
      date: new Date(this.form.value.date),  // Asegúrate de convertir la fecha
      status: this.task.status  // Mantener el estado original si se está actualizando
    };

    this.academicService.updateTask(this.task.id, updatedTask).then(async () => {
      this.utilsSrv.dismissModal({ success: true });

      this.utilsSrv.showToast({
        message: 'Tarea Actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
        // Luego, después de 5 segundos, mostrar el mensaje de advertencia
    setTimeout(() => {
      this.utilsSrv.showToast({
        message: 'Tu entrega se ha Actualizado para calificar',
        duration: 15000,
        color: 'warning',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }, 5000); // Retraso 
    }).catch(error => {
      console.log(error);

      this.utilsSrv.showToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  // ========== Eliminar tarea ==========
  // Eliminar la tarea directamente desde el modal
  async deleteTask() {
    const loading = await this.utilsSrv.loading();
    await loading.present();

    try {
      await this.academicService.deleteTask(this.task.id);

      this.utilsSrv.dismissModal({ success: true });

      this.utilsSrv.showToast({
        message: 'Tarea eliminada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'trash-outline'
      });
    } catch (error) {
      console.log(error);

      this.utilsSrv.showToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }

  }

}
