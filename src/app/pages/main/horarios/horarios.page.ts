import { Component, OnInit } from '@angular/core';
import { AcademicService } from 'src/app/services/academic.service';



@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  horarios: any = {};  // Variable para almacenar los horarios

  constructor(private academicService: AcademicService) { }

  ngOnInit() {
    // Obtener los horarios desde el servicio
    this.academicService.getHorarios().subscribe(data => {
      this.horarios = data;  // Asignar los datos a la variable horarios
    });
  }

}
