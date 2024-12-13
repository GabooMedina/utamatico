export interface Task {
    id: string; // Id único para cada tarea en Firebase
    titulo: string;
    descripcion: string;
    date: Date;
    status: string;  // Estado de la tarea, por ejemplo: 'pendiente', 'completada'
  }
  