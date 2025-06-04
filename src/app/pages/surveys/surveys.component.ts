import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import * as $ from 'jquery']
declare var $: any;

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.scss']
})
export class SurveysComponent implements OnInit {
  surveyCount: number = 0;
  surveys: Object;
  SurveyForm: FormGroup;
  @ViewChild('addSurveyModal') addSurveyModal: any;
  @ViewChild('surveyTable') surveyTable: any;
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.SurveyForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      phone: ['', Validators.required],
      nationality: [''],
      latitude: [''],
      longitude: ['']
    });
   }


  ngOnInit() {
    const token = localStorage.getItem('Authorization');
    this.http.get<{ total: number }>('http://localhost:3000/api/survey/Count', {
      headers: {
      'Authorization': `${token}`
      }
    }).toPromise()
      .then(response => {
        this.surveyCount = response.total;
      },
      error => {
        console.error('Error al obtener el conteo de encuestas:', error);
      }
      );
      this.getSurveys();
    }

    openAddSurveyModal() {
      $('#addSurveyModal').modal('show');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.SurveyForm.patchValue({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error obteniendo la ubicación:', error);
          }
        );
      } else {
        console.error('La geolocalización no es soportada por este navegador.');
      }
    }
    // Método para obtener el listado de encuestas
  getSurveys() {
    const token = localStorage.getItem('Authorization');
    this.http.get('http://localhost:3000/api/survey/', {
      headers: {
      'Authorization': `${token}`
      }
    }).toPromise()
      .then(
      (response) => {
        this.surveys = response;
      },
      (error) => {
        console.error('Error al obtener encuestas:', error);
      }
      );
    }

  // Método para agregar una nueva encuesta
  addSurvey(form: FormGroup) {
    if (form.invalid) {
      return;
    }
    const surveyData = form.value;
    console.log('Datos de la encuesta:', surveyData);
    const token = localStorage.getItem('Authorization');
    this.http.post('http://localhost:3000/api/survey/', surveyData, {
      headers: {
        'Authorization': `${token}`
      }
    }).toPromise()
      .then(
        (response) => {
          console.log('Encuesta creada exitosamente:', response);
          this.getSurveys(); // Recargar el listado de encuestas
          this.modalService.dismissAll(); // Cerrar el modal
        },
        (error) => {
          console.error('Error al agregar encuesta:', error);
        }
      );
  }
  // Método para eliminar una encuesta
deleteSurvey(surveyId: string) {
  const token = localStorage.getItem('Authorization');
  this.http.delete(`http://localhost:3000/api/survey/${surveyId}`, {
    headers: {
      'Authorization': `${token}`
    }
  }).toPromise()
    .then(
      (response) => {
        console.log('Encuesta eliminada exitosamente:', response);
        this.getSurveys(); // Recargar el listado de encuestas
      },
      (error) => {
        console.error('Error al eliminar encuesta:', error);
      }
    );
}
  // Método para editar una encuesta
editSurvey(surveyId: string, form: FormGroup) {
  if (form.invalid) {
    return;
  }
  const surveyData = form.value;
  console.log('Datos de la encuesta a editar:', surveyData);
  const token = localStorage.getItem('Authorization');
  this.http.put(`http://localhost:3000/api/survey/${surveyId}`, surveyData, {
    headers: {
      'Authorization': `${token}`
    }
  }).toPromise()
    .then(
      (response) => {
        console.log('Encuesta editada exitosamente:', response);
        this.getSurveys(); // Recargar el listado de encuestas
        this.modalService.dismissAll(); // Cerrar el modal
      },
      (error) => {
        console.error('Error al editar encuesta:', error);
      }
    );
  }

}
