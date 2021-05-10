
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  validations_form: FormGroup;
  genders: Array<string>;
  matching_passwords_group: FormGroup;
  
 /* Editamos home.page.ts y añadimos un array asociativo como atributo de la clase, con un campo para cada atributo del formulario.
 Para cada uno de estos campos añadir como valor un array donde cada entrada será un array asociativo con dos campos a su vez:
  type (tipo de mensaje) y message(el error que queremos que salga si se da ese tipo de error).
*/
  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters, and must begin with a letter.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.' },
      { type: 'maxlength', message: 'Password must be less than or equal to 15 characters.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, one number and one of this characters: . - ;' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required.' }
    ],
    'matching_passwords': [
      { type: 'confirmPassword', message: 'Password mismatch.' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

constructor(
  public formBuilder: FormBuilder,
  private navCtrl: NavController
) { }

ngOnInit() {

  this.genders = [
    "Male",
    "Female"
  ];

  /*La expresión regular de validación de la clave consta de estas partes:
(?=.{8,})  comprueba que al menos tiene 8 caracteres
(?=.*[a-z]) comprueba que contiene al menos una minúscula
(?=.*[A-Z]) comprueba que contiene al menos una mayúscula
(?=.*[0-9]) comprueba que contiene al menos un dígito
(?=.*[.,-]).*$')  comprueba que contiene al menos uno de estos tres caracteres: . , -
.*        captura toda la cadena si se cumplen las anteriores condiciones
*/
  this.matching_passwords_group = new FormGroup({
    password: new FormControl('', Validators.compose([
      Validators.maxLength(15),
      Validators.minLength(8),
      Validators.pattern('^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,-]).*$'),
      Validators.required
    ])),
    confirmPassword: new FormControl('', Validators.required)
  }, (formGroup: FormGroup) => {
    return this.confirmPassword(formGroup);
  });


  this.validations_form = this.formBuilder.group({
    username: new FormControl('', Validators.compose([
      this.validUsername,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern('^[a-zA-Z]{1}[a-zA-Z0-9]+$'),
      Validators.required
    ])),
    name: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$')
    ])),
    gender: new FormControl(this.genders[0], Validators.required),
    terms: new FormControl(false, Validators.pattern('true')),
    matching_passwords: this.matching_passwords_group
  });
}

/*Al pulsar el botón submit se llama a este método que recibe como parámetro todos los valores introducidos en el formulario.
Para pasar estos valores a la siguiente página se crea un objeto de la clase NavigationExtras.
Este objeto es un array asociativo donde definimos un campo queryParams, que a su vez es otro array asociativo.
Dentro de queryParams creamos una pareja clave-valor para cada parámetro que queramos pasar a la otra página
El valor asociado a 'user' es un objeto. Siempre que queramos pasar un objeto como parámetro tenemos que pasarlo a JSON.
*/
onSubmit(values) {
  console.log(values);
  let navigationExtras: NavigationExtras = {
    queryParams: {
      user: JSON.stringify(values),
      numero: 3
    }
  };
  this.navCtrl.navigateForward('/user', navigationExtras);
}

/* Añadimos un nuevo método a la clase controladora que verifique que el nombre de usuario que se introduce
no es 'abc123' o 'cba321' En caso de introducir cualquiera de los dos se supondrá que ese nombre de usuario
ya está en uso, y no se dará por válido el campo.*/
validUsername(fc: FormControl) {
  if (fc.value.toLowerCase() === "abc123" || fc.value.toLowerCase() === "cba321") {
    return ({ validUsername: true });
  } else {
    return (null);
  }
}

// No entiendo que sea != en vez de === | o si fuera != que sea false sería lo lógico.
confirmPassword(fg: FormGroup) {
  if (fg.controls['password'].value != fg.controls['confirmPassword'].value)
    return ({ confirmPassword: true });
  else
    return (null);
}

}//end_class