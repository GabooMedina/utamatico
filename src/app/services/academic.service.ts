import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore'; // Importar Timestamp
import { Task } from '../models/task.interface';


@Injectable({
    providedIn: 'root'
})
export class AcademicService {
    private subjectsCollection = 'materia';  // Nombre de la colección en Firebase
    private tasksCollection = 'tareas';

    constructor(private firestore: AngularFirestore) { }

    // Obtener materias desde Firebase
    getSubjects(): Observable<any[]> {
        return this.firestore.collection(this.subjectsCollection).valueChanges();
    }

    getTasks(): Observable<Task[]> {
        return this.firestore.collection(this.tasksCollection).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Task;
            const id = a.payload.doc.id;
            return { id, ...data };  
          }))
        );
      }
      

    async addTask(task: any): Promise<void> {
        const taskRef = this.firestore.collection(this.tasksCollection).doc(); // Crear un nuevo documento con un ID auto-generado
        try {
            // Convertir `task.date` a un objeto Date si es necesario
            const date = task.date instanceof Date ? task.date : new Date(task.date);
    
            return await taskRef.set({
                titulo: task.titulo,
                descripcion: task.descripcion,
                date: date, // Asegúrate de que sea un objeto Date válido
                status: task.status || 'pendiente' // Agregar estado por defecto si no está definido
            });
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
            throw new Error('Error al agregar la tarea');
        }
    }
    

    // Actualizar una tarea existente
    async updateTask(taskId: string, task: Task): Promise<void> {
        const taskRef = this.firestore.collection(this.tasksCollection).doc(taskId);
        try {
            return await taskRef.update({
                titulo: task.titulo,
                descripcion: task.descripcion,
                date: Timestamp.fromDate(task.date), // Convertir Date a Timestamp
                status: task.status
            });
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            throw new Error('Error al actualizar la tarea');
        }
    }

    // Método para eliminar una tarea
async deleteTask(taskId: string): Promise<void> {
    const taskRef = this.firestore.collection(this.tasksCollection).doc(taskId);
    try {
      await taskRef.delete();  // Eliminar la tarea utilizando el ID
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      throw new Error('Error al eliminar la tarea');
    }
  }
  
    
}
