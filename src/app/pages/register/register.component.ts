import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
checkPasswordStrength(password: string): void {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    const strengthTextElement = document.getElementById('password-strength');
    if (!strengthTextElement) return;

    let strengthText = '';
    let strengthColor = '';

    switch (strength) {
      case 5:
        strengthText = 'Muy fuerte';
        strengthColor = 'green';
        break;
      case 4:
        strengthText = 'Fuerte';
        strengthColor = 'blue';
        break;
      case 3:
        strengthText = 'Moderada';
        strengthColor = 'orange';
        break;
      case 2:
        strengthText = 'Débil';
        strengthColor = 'red';
        break;
      default:
        strengthText = 'Muy débil';
        strengthColor = 'darkred';
        break;
    }

    strengthTextElement.textContent = strengthText;
    strengthTextElement.style.color = strengthColor;
  }

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      alert('El formulario es válido. Procediendo con el registro...');
      // Aquí puedes agregar la lógica para enviar los datos del formulario
    } else {
      const invalidFields = Object.keys(this.registerForm.controls).filter(field =>
        this.registerForm.get(field)?.invalid
      );
      alert(`El formulario es inválido. Por favor, revisa los campos: ${invalidFields.join(', ')}`);
      this.registerForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      return;
    }

    const { username, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const userData = { username, email, password };

    // Simulación de llamada a la API
    fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en el registro');
        }
        return response.json();
      })
      .then(data => {
        alert('Registro exitoso');
        console.log('Respuesta de la API:', data);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema con el registro.');
      });
  }
}
