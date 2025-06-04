import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  public user: { name: string } = { name: 'Guest' }; // Example user object
  constructor(location: Location,  private element: ElementRef, private router: Router) {
    this.location = location;
  }

  ngOnInit() {
    this.checkAuthToken();
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const username = localStorage.getItem('username') || sessionStorage.getItem('username');
    if (username) {
      this.user.name = username;
    } else {
      console.warn('No username found in localStorage or sessionStorage.');
    }
  }
   checkAuthToken(): void {
    const authToken = localStorage.getItem('Authorization');
    if (!authToken) {
      // alert('Usuario no autenticado. Redirigiendo a inicio de sesión...');
      this.logout();
    }
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }

    return 'tables';
  }

    logout(): void {
    // limpiar el almacenamiento local y de sesión
    localStorage.removeItem('Authorization');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');

    // Redirigir a la página de inicio de sesión
    window.location.href = '#/login';
  }
}
