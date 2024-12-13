import { Component, inject, OnInit } from '@angular/core';
import { AcademicService } from 'src/app/services/academic.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
})
export class TareasPage implements OnInit {

  utilsSrv = inject(UtilsService)
  academicService = inject(AcademicService)
  alertCtrl = inject(AlertController)
  tasks: any[] = [];

  ngOnInit() {
    this.loadTareas();
  }

  // Cargar las tareas desde Firebase
  loadTareas() {
    this.academicService.getTasks().subscribe({
      next: (data) => {
        console.log(data);
        this.tasks = data;
      },
      error: (err) => {
        console.error('Error al cargar tareas:', err);
      }
    });
  }

  // Abrir el modal para agregar o editar tarea
  openTaskModal(task?: any) {
    let success = this.utilsSrv.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { task }
    });
    if (success) this.loadTareas();
  }

  // Confirmar eliminación de tarea
  async confirmDeleteTask(task: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la tarea "${task.titulo}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteTask(task);
          },
        },
      ],
    });

    await alert.present();
  }

  // Eliminar tarea
  async deleteTask(task: any) {
    const loading = await this.utilsSrv.loading();
    await loading.present();

    try {
      await this.academicService.deleteTask(task.id);  // Eliminar la tarea usando el id
      this.utilsSrv.showToast({
        message: 'Tarea eliminada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'trash-outline'
      });
      this.loadTareas(); // Recargar las tareas
    } catch (error) {
      console.log(error);
      this.utilsSrv.showToast({
        message: 'Error al eliminar la tarea',
        duration: 1500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  // Editar tarea
  addUpdateTask(task: any) {
    this.openTaskModal(task);  // Abre el modal con la tarea seleccionada
  }

  
}
