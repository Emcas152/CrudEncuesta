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
  SurveyEditForm: FormGroup;
  @ViewChild('addSurveyModal') addSurveyModal: any;
  @ViewChild('editSurveyModal') editSurveyModal: any;
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
    this.SurveyEditForm = this.fb.group({
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
    selectedSurveyId: string | null = null;

    openEditSurveyModal(survey: any) {
      this.selectedSurveyId = survey;
      this.SurveyEditForm.reset(); // Reset the form before patching
      const token = localStorage.getItem('Authorization');
      this.http.get(`http://localhost:3000/api/survey/${this.selectedSurveyId}`, {
        headers: {
          'Authorization': `${token}`
        }
      }).toPromise()
        .then((response: any) => {
          // Ensure only the fields present in the form are patched
          const formData = {
            id: response.id || '', // Ensure _id is used if available
            name: response.name || '',
            address: response.address || '',
            phone: response.phone || '',
            nationality: response.nationality || '',
            latitude: response.latitude || '',
            longitude: response.longitude || ''
          };
          console.log('Datos de la encuesta para editar:', formData);
          this.SurveyEditForm.patchValue(formData);
        })
        .catch((error) => {
          console.error('Error al obtener los datos de la encuesta:', error);
        });
      // Ensure all properties exist and are not undefined

      setTimeout(() => {
        $('#editSurveyModal').modal('show');
      }, 0); // Ensure modal opens after form is patched
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
          $('#addSurveyModal').modal('hide'); // Cerrar el modal
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
  console.log('Formulario de edición recibido:', form);
  console.log('ID de la encuesta a editar:', surveyId);
  if (form.invalid) {
    return;
  }
  console.log('ID de la encuesta a editar:', surveyId);
  console.log('Formulario de edición:', form);
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
        $('#editSurveyModal').modal('hide'); // Cerrar el modal
      },
      (error) => {
        console.error('Error al editar encuesta:', error);
      }
    );
  }

}
