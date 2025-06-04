import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.http.post('http://localhost:3000/api/auth/login', { username, password })
        .subscribe({
          next: (response) => {
            // console.log('Login successful:', response);
            if (this.loginForm.get('rememberMe')?.value) {
              localStorage.setItem('username', username);
              localStorage.setItem('password', password);
            }
            // Save the token and redirect to the tables page
            const token = (response as any).token;
            localStorage.setItem('Authorization', token);
            sessionStorage.setItem('username', (response as any).user.username);
            sessionStorage.setItem('email', (response as any).user.email);
            // Redirigir a la página de surveys
            window.location.href = '#/surveys';
          },
          error: (error) => {
            console.error('Login failed:', error);
            // Manejo de errores, como mostrar un mensaje al usuario
          }
        });
    } else {
      console.log(this.loginForm.controls);
      console.error('Form is invalid');
    }
  }
}
