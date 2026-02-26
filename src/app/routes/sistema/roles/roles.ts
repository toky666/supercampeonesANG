import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { PageHeader } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RolesServicesService } from '../../services/roles-services.service';
import { rolesInterfaz } from '../../Interfaces/rolesInterfaz';
//PARA LLAMAR JAVASCRIPT/////
declare let alertify: any;
@Component({
  selector: 'app-sistema-roles',
  imports: [
    PageHeader,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './roles.html',
  standalone: true,
  styleUrl: './roles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SistemaRoles {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  private dialog = inject(MatDialog);
  private dataService = inject(RolesServicesService);
 


  form = new FormGroup({
    name: new FormControl<string>(''), // ahora es siempre string
  });

  openDialog() {
    this.dialog.open(this.dialogTemplate, { width: '400px' });
  }

  saveData() {
    if (this.form.valid) {
      this.dataService.save(this.form.value as rolesInterfaz).subscribe(
        (data) => {
          console.log('Se agrego el rol a la lista');
        },
        (error) => {
          console.log(error);
          console.log('Se desconecto el servidor de la lista');
        },
      );
    } else {
      console.log('Llene todos los campos');
    }
  }
}
