import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { PageHeader } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgClass } from '@angular/common'; // importa NgClass
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { RolesServicesService } from '../../services/roles-services.service';
import { rolesInterfaz } from '../../Interfaces/rolesInterfaz';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { dataAddress, usersInterfaz } from '../../Interfaces/usersInterfaz';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { UsersServicesService } from '../../services/users-services.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EmailServicesService } from '../../services/email-services.service';
import { emailInterfaz } from '../../Interfaces/emailInterfaz';

//PARA LLAMAR JAVASCRIPT/////
declare let alertify: any;
interface selectsExp {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-usuarios-add-usuarios',
  imports: [
    PageHeader,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    NgClass,
    MatTooltipModule,
    TranslateModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatStepperModule,
    MatButtonToggleModule,
  ],
  templateUrl: './add-usuarios.html',
  styleUrl: './add-usuarios.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // habilita <iconify-icon>
})
export class UsuariosAddUsuarios implements OnInit {
  private translate = inject(TranslateService);
  private dataServiceRoles = inject(RolesServicesService);
  private _formBuilder = inject(FormBuilder);
  private dataService = inject(UsersServicesService);
  private dataemail = inject(EmailServicesService);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  selectsExp: selectsExp[] = [
    { value: 'LP', viewValue: 'LP' },
    { value: 'CH', viewValue: 'CH' },
    { value: 'CB', viewValue: 'CB' },
    { value: 'OR', viewValue: 'OR' },
    { value: 'PT', viewValue: 'PT' },
    { value: 'TJ', viewValue: 'TJ' },
    { value: 'SC', viewValue: 'SC' },
    { value: 'BE', viewValue: 'BE' },
    { value: 'PD', viewValue: 'PD' },
  ];
  user: usersInterfaz = new usersInterfaz();
  dataRoles: rolesInterfaz = {
    name: '',
  };

  form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required] }), // ahora es siempre string
  });

  dataForm = new FormGroup({
    //names: ['', [Validators.required]],
    names: new FormControl<string>('', { validators: [Validators.required] }),
    last_names: new FormControl<string>('', { validators: [Validators.required] }),
    ci: new FormControl<string>('', { validators: [Validators.required] }),
    exp: new FormControl<string>('', { validators: [Validators.required] }),
    phone: new FormControl<string>('', { validators: [Validators.required] }),
    email: new FormControl<string>('', { validators: [Validators.required] }),
    idrol: new FormControl<any>(null, { validators: [Validators.required] }),
    password: new FormControl<string>('', { validators: [Validators.required] }),
    sex: new FormControl<string>('', { validators: [Validators.required] }),
    //estado: new FormControl<string>('', { validators: [Validators.required] }),

    //

    birthday: new FormControl<string>('', { validators: [Validators.required] }),
    //address: new FormControl<string>('', { validators: [Validators.required] }),
    // address: this.listaAddress,
    // address: this._fb.group({
    // country: [''],
    // city: [''],
    // province: [''],
    // district: [''],
    // road: [''],
    // neighbourhood: [''],
    // number: [''],
    // edifice: [''],
    // obs: [''],
    // lat: [''],
    // lon: [''],
    // }),

    /*country: new FormControl<string>('', { validators: [Validators.required] }),
    city: new FormControl<string>('', { validators: [Validators.required] }),
    province: new FormControl<string>('', { validators: [Validators.required] }),
    district: new FormControl<string>('', { validators: [Validators.required] }),
    road: new FormControl<string>('', { validators: [Validators.required] }),
    neighbourhood: new FormControl<string>('', { validators: [Validators.required] }),
    number: new FormControl<string>('', { validators: [Validators.required] }),
    edifice: new FormControl<string>('', { validators: [Validators.required] }),
    obs: new FormControl<string>('', { validators: [Validators.required] }),
    //lat: [{ value: '', disabled: true }],
    lat: new FormControl<string>('', { validators: [Validators.required] }),
    lon: new FormControl<string>('', { validators: [Validators.required] }),

    apartment: new FormControl<string>('', { validators: [Validators.required] }),
    residence: new FormControl<string>('', { validators: [Validators.required] }),
    property: new FormControl<string>('', { validators: [Validators.required] }),
    time: new FormControl<string>('', { validators: [Validators.required] }),*/
  });

  selectsRoles!: rolesInterfaz[];
  listaAddress!: dataAddress[];
  selects3!: usersInterfaz[];
  envioEmail!: emailInterfaz[];

  verificar_password: any;
  letter = 1;
  optionSex = 0;

  ngOnInit(): void {
    this.form.get('name')?.valueChanges.subscribe((val) => {
      if (val) {
        this.form.get('name')?.setValue(val.toUpperCase(), { emitEvent: false });
      }
    });

    this.translate.use('en-US'); // idioma inicial
    this.SelectListDataRoles();
  }
  prueba(ide: any) {
    this.user.exp = ide;
    console.log(this.user.exp);
  }

  getDataRoles(ide1: any) {
    this.dataServiceRoles.findOne(ide1).subscribe(
      (data) => {
        this.dataForm.get('idrol')?.setValue(data._id);
      },
      (err) => {
        console.log(err);
      },
    );
  }

  SelectListDataRoles() {
    this.dataServiceRoles.list().subscribe(
      (data) => {
        this.selectsRoles = data.rows;
      },
      (err) => {
        console.log(err);
      },
    );
  }
  fecha_nacimiento1: any;
  verificarFecha() {
    console.log(this.fecha_nacimiento1);
  }
  password: any;
  verificar: any;

  verificarPassword(event: any) {
    this.password = this.dataForm.get('password')?.value;
    this.verificar = event.target.value;
    if (this.password === this.verificar) {
      console.log('valido');
      this.letter = 2;
    } else {
      console.log('no valido');
      this.letter = 3;
    }
  }
  option: any;
  selectedColor = 'white';

  selectGender(option: string) {
    this.dataForm.get('sex')?.setValue(option);
    switch (option) {
      case 'male':
        this.selectedColor = '#4A90E2'; // azul
        this.optionSex = 1;
        break;
      case 'female':
        this.selectedColor = '#FF69B4'; // rosa
        this.optionSex = 2;
        break;
    }
  }
  inputEmail: any;
  saveData() {
    // Supongamos que tu formulario solo tiene el campo email
    const emailValue = this.dataForm.get('email')?.value;
    const paswoodValue = this.dataForm.get('password')?.value;

    this.inputEmail = {
      email: emailValue,
      password: paswoodValue,
    } as emailInterfaz;

    if (this.password === this.verificar) {
      this.dataService.findEmail(emailValue).subscribe(
        (data) => {
          this.selects3 = data;
          console.log(emailValue);
          if (this.selects3.length) {
            alertify.warning('Email Existe');
          } else {
            this.dataService.save(this.dataForm.value as usersInterfaz).subscribe({
              next: () => {
                alertify.success('Se guardo correctamente');
                // Ahora llamas al servicio
                this.dataemail.sendUser(this.inputEmail).subscribe({
                  next: () => {},
                  error: () => {},
                });
              },
              error: () => {
                alertify.error('Se desconecto el servidor');
              },
            });
          }
        },
        (err) => {
          console.log(err);
        },
      );
    } else {
      alertify.warning('El password no coincide');
    }
  }
}
