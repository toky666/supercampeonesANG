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
import { NgClass } from '@angular/common'; // importa NgClass
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { RolesServicesService } from '../../services/roles-services.service';
import { rolesInterfaz } from '../../Interfaces/rolesInterfaz';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { usersInterfaz } from '../../Interfaces/usersInterfaz';


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
    MatTabsModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './add-usuarios.html',
  styleUrl: './add-usuarios.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // habilita <iconify-icon>
})
export class UsuariosAddUsuarios implements OnInit {
  private translate = inject(TranslateService);
  private dataServiceRoles = inject(RolesServicesService);


  user: usersInterfaz = new usersInterfaz();
  dataRoles: rolesInterfaz = {
    name: '',
  };

  form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required] }), // ahora es siempre string
  });

  selectsRoles!: rolesInterfaz[];

  ngOnInit(): void {
    this.form.get('name')?.valueChanges.subscribe((val) => {
      if (val) {
        this.form.get('name')?.setValue(val.toUpperCase(), { emitEvent: false });
      }
    });
    this.translate.use('en-US'); // idioma inicial
    this.SelectListDataRoles();
  }

  saveData() {}

  getDataRoles(ide1: any) {
    this.dataServiceRoles.findOne(ide1._id).subscribe(
      (data) => {
        this.user.idrol = data._id;
        this.user.namerol = data.name;
        
        console.log('roles de verdad');
        console.log(this.user.namerol);
        console.log(this.user.idrol);
      },
      (err) => {
        console.log(err);
      },
    );
  }

    SelectListDataRoles() {
    this.dataServiceRoles.list().subscribe(
      data => {
        this.selectsRoles = data.rows;
      },
      err => {
        console.log(err);
      }
    );
  }
}
