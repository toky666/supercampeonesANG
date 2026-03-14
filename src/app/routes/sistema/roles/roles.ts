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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgClass,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './roles.html',
  standalone: true,
  styleUrl: './roles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // habilita <iconify-icon>
})
export class SistemaRoles implements OnInit {
  dataRoles: rolesInterfaz = {
    name: '',
  };

  @ViewChild('dialogAdd') dialogAdd!: TemplateRef<any>;
  @ViewChild('dialogDelete') dialogDelete!: TemplateRef<any>;
  @ViewChild('dialogUpdate') dialogUpdate!: TemplateRef<any>;
  @ViewChild(MatSort) myMatSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;

  private dialog = inject(MatDialog);
  private dataService = inject(RolesServicesService);
  // ✅ Usamos inject en lugar de constructor
  private translate = inject(TranslateService);

  public page = 1;
  public total = 0;
  public query: any = {};
  public limit = 5;
  pageSize = 5;
  pageIndex = 0;
  filter: any = '';
  offset = 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['nombre', 'action'];

  dataDelete: any;
  nameDelete: any;
  dataUpdate: any;
  nameUpdate: any;

  dataSource = new MatTableDataSource<any>();
  // Control para el input de búsqueda
  searchControl = new FormControl('');

  form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required] }), // ahora es siempre string
  });

  ngOnInit(): void {
    this.form.get('name')?.valueChanges.subscribe((val) => {
      if (val) {
        this.form.get('name')?.setValue(val.toUpperCase(), { emitEvent: false });
      }
    });

    this.translate.use('en-US'); // idioma inicial
    this.refreshData();
  }

  /*********************************************METDODOS****************************************************/
  ActuallyTable() {
    this.dataService.dataTablePagination(this.query).subscribe(
      (data) => {
        this.dataSource.data = data.data;
        this.total = data.count;
      },
      (err) => console.error('Error al actualizar datos', err),
    );
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.paginator.pageSize = 5;
    this.paginator.firstPage();
    //  Reset del sort (quita flecha)
    this.myMatSort.active = '';
    this.myMatSort.direction = '';
    this.myMatSort.sortChange.emit({ active: '', direction: '' });
    this.refreshData();
    this.filter = '';
  }

  closedModal() {
    this.myMatSort.active = 'id';
    this.form.reset();
    this.dialog.closeAll();
  }

  deleteData(): void {
    this.dataService.remove(this.dataDelete).subscribe({
      next: () => {
        this.clearSearch();
        this.closedModal();
        alertify.success('Se elimino correctamente');
      },
      error: () => {
        alertify.error('Se desconecto el servidor');
      },
    });
  }

  doFilter(filterValue: string) {
    this.limit = 5;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.paginator.firstPage();

    if (filterValue.length > 0) {
      this.filter = filterValue;
      if (!this.myMatSort.active || this.myMatSort.direction === 'asc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: 1 },
        };
      }

      if (this.myMatSort.active || this.myMatSort.direction === 'desc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: -1 },
        };
      }

      if (!this.myMatSort.active || this.myMatSort.direction === '') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { createdAt: -1 },
        };
      }
      this.loadData(this.filter);
    }else{
      this.refreshData();
    }
  }

  filterAsc(filterValue = '') {
    let sortObj: Record<string, number> = { name: 1 }; // de primero al ultimo
    if (this.myMatSort?.active && this.myMatSort.active.trim() !== '' && this.myMatSort.direction) {
      sortObj = { [this.myMatSort.active]: this.myMatSort.direction === 'desc' ? -1 : 1 };
    }

    const query = {
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize,
      query: filterValue ? { name: filterValue } : {},
      sort: { name: 1 },
    };
    this.dataService.doFilter(query).subscribe((res) => {
      this.dataSource.data = res.data;
      this.total = res.count;

      console.log('desde loaddata');
      console.log(this.dataSource.data);
    });
  }

  filterDesc(filterValue = '') {
    let sortObj: Record<string, number> = { name: -1 }; // de ultimo al primero orden
    if (this.myMatSort?.active && this.myMatSort.active.trim() !== '' && this.myMatSort.direction) {
      sortObj = { [this.myMatSort.active]: this.myMatSort.direction === 'desc' ? -1 : 1 };
    }

    const query = {
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize,
      query: filterValue ? { name: filterValue } : {},
      sort: { name: -1 },
    };

    this.dataService.doFilter(query).subscribe((res) => {
      this.dataSource.data = res.data;
      this.total = res.count;
    });
  }

  filterNormal(filterValue = '') {
    let sortObj: Record<string, number> = { createdAt: -1 };
    if (this.myMatSort?.active && this.myMatSort.active.trim() !== '' && this.myMatSort.direction) {
      sortObj = { [this.myMatSort.active]: this.myMatSort.direction === 'desc' ? -1 : 1 };
    }

    const query = {
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize,
      query: filterValue ? { name: filterValue } : {},
      sort: sortObj,
    };
    this.dataService.doFilter(query).subscribe((res) => {
      this.dataSource.data = res.data;
      this.total = res.count;
    });
  }

  loadData(filterValue = '') {
    switch (this.myMatSort.direction) {
      case 'asc':
        this.filterAsc(filterValue);
        break;
      case 'desc':
        this.filterDesc(filterValue);
        break;
      case '':
        this.filterNormal(filterValue);
        break;
      default:
        console.log('ERROR LOADDATA');
        break;
    }
  }

  onSortChange() {
    if (this.filter.length > 0) {
      if (this.myMatSort.direction === 'asc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: 1 },
        };
      }
      if (this.myMatSort.direction === 'desc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: -1 },
        };
      }
      if (this.myMatSort.direction === '') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { createdAt: -1 },
        };
      }

      this.loadData(this.filter);
      return;
    } else {
      if (this.myMatSort.direction === 'asc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
      }
      if (this.myMatSort.direction === 'desc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
      }
      if (this.myMatSort.direction === '') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
      }
      this.ActuallyTable();
      return;
    }
  }

  openModalDelete(ide: any, name: any) {
    this.dataDelete = ide;
    this.nameDelete = name;
    this.dialog.open(this.dialogDelete, {
      width: '900px',
      height: '250px',
      disableClose: true,
      panelClass: 'square-dialog',
    });
  }

  openModalSave() {
    this.dialog.open(this.dialogAdd, {
      width: '900px',
      height: '250px',
      disableClose: true,
      panelClass: 'square-dialog', // clase personalizada
    });
  }

  openModalUpdate(ide: any, name: any) {
    this.dataUpdate = ide;
    this.dataRoles.name = name;
    this.dialog.open(this.dialogUpdate, {
      width: '900px',
      height: '250px',
      disableClose: true,
      panelClass: 'square-dialog',
    });
  }

  pageChanged(event: any): void {
    this.offset = event.pageSize * event.pageIndex;
    this.limit = event.pageSize;
    this.page = 1;
    if (this.filter.length > 0) {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
      if (this.myMatSort.direction === '') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
      }
      if (this.myMatSort.direction === 'asc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
      }
      if (this.myMatSort.direction === 'desc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
      }
      this.loadData(this.filter); // usa el filtro actual
    } else {
      if (this.myMatSort.direction === '') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
      }
      if (this.myMatSort.direction === 'asc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
      }
      if (this.myMatSort.direction === 'desc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
      }
      this.ActuallyTable();
    }
  }

  refreshData(): void {
    const query = { page: 1, size: 5 };
    this.dataService.dataTablePagination(query).subscribe(
      (data) => {
        this.dataSource.data = data.data;
        this.total = data.count;
      },
      (err) => console.error('Error al cargar datos', err),
    );
  }

  saveData() {
    if (this.form.valid) {
      this.dataService.save(this.form.value as rolesInterfaz).subscribe({
        next: () => {
          this.clearSearch();
          this.closedModal();
          alertify.success('Se guardo correctamente');
        },
        error: () => {
          alertify.error('Se desconecto el servidor');
        },
      });
    }
  }

  updateData() {
    if (this.form.valid) {
      this.dataService.update(this.dataUpdate, this.dataRoles).subscribe({
        next: (res) => {
          if (this.filter.length > 0) {
            if (res.pageIndex !== undefined) {
              this.pageIndex = res.pageIndex;
              const prueba = this.pageIndex;
            }
            this.loadData(this.filter);
            this.closedModal();
          } else {
            this.ActuallyTable();
            this.closedModal();
          }
          this.dataSource.sort = this.myMatSort;
          this.myMatSort.active = 'id';

          if (this.myMatSort.direction == 'asc') {
            this.myMatSort.direction = 'asc';
            this.dataSource.sort = this.myMatSort;
          }
          if (this.myMatSort.direction == 'desc') {
            this.myMatSort.direction = 'desc';
            this.dataSource.sort = this.myMatSort;
          }
          if (this.myMatSort.direction == '') {
            this.myMatSort.direction = '';
            this.dataSource.sort = this.myMatSort;
          }
          this.table.renderRows();
          alertify.success('Se modifico correctamente');
        },
        error: () => {
          alertify.error('Se desconecto el servidor');
        },
      });
    } else {
      alertify.info('formulario no valido');
    }
  }
}
