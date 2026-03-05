import {
  ChangeDetectionStrategy,
  AfterViewInit,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { PageHeader } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { RolesServicesService } from '../../services/roles-services.service';
import { rolesInterfaz } from '../../Interfaces/rolesInterfaz';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
  ],
  templateUrl: './roles.html',
  standalone: true,
  styleUrl: './roles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // habilita <iconify-icon>
})
export class SistemaRoles implements OnInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  value = '';
  element = true;
  displayedColumns: string[] = ['nombre', 'action'];
  dataSource: any;
  public page = 1;
  public total = 0;
  public query: any = {};
  public limit = 5;
  sortBandera = 3;
  filter: any = '';
  offset = 0;

  // Control para el input de búsqueda
  searchControl = new FormControl('');
  pageSizeOptions: number[] = [5, 10, 25, 100];

  dataSave: rolesInterfaz = {
    name: '',
  };
  @ViewChild('dialogAdd') dialogAdd!: TemplateRef<any>;
  @ViewChild('dialogDelete') dialogDelete!: TemplateRef<any>;
  @ViewChild('dialogUpdate') dialogUpdate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  @ViewChild(MatSort) myMatSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  data: any[] = [];

  pageSize = 5;
  pageIndex = 0;
  private dialog = inject(MatDialog);
  private dataService = inject(RolesServicesService);
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        const safeValue = (value ?? '').trim(); // si es null, usa ''
        if (safeValue) {
          // hay texto → aplica filtro
          this.filter = safeValue;
          // Suscripción reactiva: cada vez que rolesSubject cambie, la tabla se actualiza
          this.dataService.roles$.subscribe((data) => {
            this.dataSource.data = data;
          });
          // fuerza el pageSize a 1
          this.loadData(this.filter);
        } else {
          this.sortBandera = 3;
          this.myMatSort.active = 'id'; // ninguna columna activa
          this.myMatSort.direction = 'desc'; // sin dirección      this.myMatSort.direction = ''; // sin dirección
          this.pageSize = 5; // valor inicial
          this.pageIndex = 0; // empieza en la primera página
          //this.dataSource.data = [...this.dataSource.data, data];
          //this.myMatSort.sort({ id: '', start: 'desc', disableClear: false });
          this.paginator.firstPage(); // mueve el paginador a la última página

          this.filter = '';
          this.initTable(); // no hay texto → reinicia tabla
        }
      });

    //this.myMatSort.sort({ id: '', start: 'desc', disableClear: false });
    this.dataSource = new MatTableDataSource<any>();
    // Consulta inicial al backend al entrar o recargar
    this.dataService
      .dataTablePagination({ limit: 5, offset: 0, query: {}, sort: { _id: -1 } })
      .subscribe(); // Suscripción reactiva a los datos

    this.dataService.roles$.subscribe((data) => {
      this.dataSource.data = data;
    }); // Opcional: suscribirse al total de registros
    this.dataService.total$.subscribe((total) => {
      this.total = total;
    });
  }

  form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required] }), // ahora es siempre string
  });
  resetSort() {
    if (this.myMatSort) {
      this.sortBandera = 3;
      this.myMatSort.active = 'id'; // ninguna columna activa
      this.myMatSort.direction = 'desc'; // sin dirección      this.myMatSort.direction = ''; // sin dirección
      this.myMatSort.sortChange.emit(); // notifica a la tabla que se reinició
      this.paginator.firstPage(); // mueve el paginador a la última página
    }
  }
  openDialog() {
    this.dialog.open(this.dialogAdd, { width: '400px' });
  }

  onResetForm() {
    this.form.reset();
  }
  decline(): void {
    this.dialog.closeAll();
  }

  // Método que carga datos desde el backend
  loadData(filterValue = '') {
    let sortObj: Record<string, number> = { name: 1 };
    if (this.myMatSort?.active && this.myMatSort.active.trim() !== '' && this.myMatSort.direction) {
      sortObj = { [this.myMatSort.active]: this.myMatSort.direction === 'desc' ? -1 : 1 };
    }

    const query = {
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize,
      query: filterValue ? { name: filterValue } : {},
      sort: this.myMatSort
        ? { [this.myMatSort.active]: this.myMatSort.direction === 'desc' ? 1 : -1 }
        : { name: 1 },
    };
    this.dataService.doFilter(query).subscribe((res) => {
      this.data = res.data; // registros de la página
      console.log(this.data);
      this.total = res.count; // total
    });
    this.dataService.dataTablePagination(query).subscribe();

    // Suscripción reactiva: cada vez que rolesSubject cambie, la tabla se actualiza
    this.dataService.roles$.subscribe((data) => {
      this.dataSource.data = data;
    });
  } // Este método lo dispara el MatPaginator automáticamente
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadData(this.filter); // usa el filtro actual
  } // Cuando aplicas un filtro, reinicia a la primera página
  doFilter(filterValue: string) {
    this.sortBandera = 3;
    this.limit = 5;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.paginator.firstPage();
    console.log('Filtro aplicado:', this.pageSize);

    if (filterValue.length > 0) {
      this.filter = filterValue;
      if (this.sortBandera == 1) {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: 1 },
        };
      }

      if (this.sortBandera == 2) {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: -1 },
        };
      }

      if (this.sortBandera == 3) {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { _id: -1 },
        };
      }
      this.dataService.doFilter(this.filter).subscribe((res) => {
        this.data = res.data; // registros de la página
        this.data;
        console.log(this.data);
        this.total = res.count; // total
      });
    } else {
      this.resetFilter();
    }
  }
  onSortChange() {
    if (this.filter.length > 0) {
      if (!this.myMatSort.active || this.myMatSort.direction === 'asc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: 1 },
        };
        this.sortBandera = 1;
      }
      if (!this.myMatSort.active || this.myMatSort.direction === 'desc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: -1 },
        };
        this.sortBandera = 2;
      }
      if (!this.myMatSort.active || this.myMatSort.direction === '') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { _id: -1 },
        };
        this.sortBandera = 3;
        this.ActuallyTable();
      }

      //this.changeFilter();
      this.loadData(this.filter);
      console.log(this.sortBandera);
      return;
    } else {
      console.log('NO entro');
      if (!this.myMatSort.active || this.myMatSort.direction === 'asc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
        this.sortBandera = 1;
      }
      if (!this.myMatSort.active || this.myMatSort.direction === 'desc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
        this.sortBandera = 2;
      }
      if (!this.myMatSort.active || this.myMatSort.direction === '') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
        this.sortBandera = 3;
      }
      //this.changeFilter();
      this.ActuallyTable(); // recarga datos con el nuevo orden
      console.log(this.sortBandera);
      return;
    }

    // recarga datos con el nuevo orden
  }

  doFilter00000(filterValue: string) {
    if (filterValue.length > 0) {
      this.filter = filterValue;
      if (this.sortBandera == 1) {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: filterValue },
          sort: { name: 1 },
        };
      }

      if (this.sortBandera == 2) {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: filterValue },
          sort: { name: -1 },
        };
      }

      if (this.sortBandera == 3) {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: filterValue },
          sort: { _id: -1 },
        };
      }

      this.changeTable(this.query);
    } else {
      this.resetFilter();
    }
  }

  getData(ide1: any) {
    this.dataService.findOne(ide1).subscribe(
      (data) => {
        this.dataUpdate.name = data.name;
      },
      (err) => {
        console.log(err);
      },
    );
  }

  initTable() {
    this.limit = 5;
    this.page = 1;
    this.query = {
      limit: this.limit,
      offset: (this.page - 1) * this.limit,
      query: {},
      sort: { _id: -1 },
    };
    console.log('entro');
    console.log(this.query);
    this.changeFilter();
  }
  changeFilter() {
    this.query.limit = this.limit;
    this.query.page = this.page;
    this.query.query = {};
    this.displayedColumns.forEach((e: any) => {
      if (e.filter && e.type == 'text' && e.value) {
        this.query.query[e.emit] = e.value;
      }
      if (e.filter && e.type == 'text' && e.sensitive && e.value) {
        this.query.query[e.emit] = { type: 'text', value: e.value };
      }
      if (e.filter && e.type == 'date' && !e.range && e.value) {
        this.query.query[e.emit] = { type: 'date', value: this.formatAsISO(e.value).split(' ')[0] };
      }
      if (e.filter && e.type == 'date' && e.range && e.value) {
        this.query.query[e.emit] = {
          type: 'range_date',
          value: [
            this.formatAsISO(e.value[0]).split(' ')[0],
            this.formatAsISO(e.value[1]).split(' ')[0],
          ],
        };
      }
      if (e.filter && e.type == 'number' && e.value) {
        this.query.query[e.emit] = { type: 'number', value: e.value };
      }
      if (e.filter && e.type == 'boolean' && e.value) {
        this.query.query[e.emit] = { type: 'boolean', value: e.value };
      }
    });
    this.changeTable(this.query);
  }

  formatAsISO(d: any) {
    function z(n: any) {
      return (n < 10 ? '0' : '') + n;
    }
    return (
      d.getFullYear() +
      '-' +
      z(d.getMonth() + 1) +
      '-' +
      z(d.getDate()) +
      ' ' +
      z(d.getHours()) +
      ':' +
      z(d.getMinutes()) +
      ':' +
      z(d.getSeconds())
    );
  }

  pageChanged(event: any): void {
    this.offset = event.pageSize * event.pageIndex;
    this.limit = event.pageSize;
    this.page = 1;
    if (this.filter.length > 0) {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;

      this.loadData(this.filter); // usa el filtro actual
    } else {
      if (this.sortBandera == 3) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
      }
      if (this.sortBandera == 1) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
      }
      if (this.sortBandera == 2) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
      }
      this.ActuallyTable();
    }
  }

  sortData(sort: Sort) {
    if (this.filter.length > 0) {
      if (!sort.active || sort.direction === 'asc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: 1 },
        };
        this.sortBandera = 1;
      }
      if (!sort.active || sort.direction === 'desc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: -1 },
        };
        this.sortBandera = 2;
      }
      if (!sort.active || sort.direction === '') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { _id: -1 },
        };
        this.sortBandera = 3;
      }

      //this.changeFilter();
      this.changeTable(this.query);
      return;
    } else {
      console.log('NO entro');
      if (!sort.active || sort.direction === 'asc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
        this.sortBandera = 1;
      }
      if (!sort.active || sort.direction === 'desc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
        this.sortBandera = 2;
      }
      if (!sort.active || sort.direction === '') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
        this.sortBandera = 3;
      }
      //this.changeFilter();
      this.changeTable(this.query);
      return;
    }
  }

  /*************************************************************************************************/
  saveData() {
    if (this.form.valid) {
      this.dataService.save(this.form.value as rolesInterfaz).subscribe({
        next: () => {
          this.ActuallyTable();
          this.paginator.firstPage(); // mueve el paginador a la última página
          this.closedModalSave();
          //this.clearSearch();
          //this.resetFilter();
        },
        error: (err) => {
          console.error('Error al guardar', err);
        },
      });
    }
  }
  clearSearch() {
    this.searchControl.setValue('');
    this.doFilter(''); // opcional: refresca la tabla sin filtro
  }

  resetFilter() {
    this.value = '';
    this.filter = '';
    this.offset = 0;
    this.page = 1;
    this.limit = 5;
    this.sortBandera = 3;
    this.pageSizeOptions = [5, 10, 25, 100];
    this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
    this.myMatSort.sort({ id: '', start: 'asc', disableClear: false });
    //this.changeTable(this.query);
    //this.showData();
  }
  changeTable(query: any) {
    this.dataService.dataTablePagination(query).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = data.data;
        this.total = data.count;
        console.log(this.dataSource.data);
      },
      (err) => {
        console.log('error ws: ');
      },
    );
  }
  showData() {
    return (this.element = true);
  }

  openModalSave() {
    this.form.reset();
    this.clearSearch();
    this.dialog.open(this.dialogAdd, {
      width: '900px',
      height: '400px',
      disableClose: true,
    });
  }

  closedModalSave() {
    this.myMatSort.active = 'id'; // ninguna columna activa
    this.form.reset();
    this.dialog.closeAll();
  }
  ActuallyTable() {
    // Primera carga rápida
    this.dataService.dataTablePagination(this.query).subscribe();

    // Suscripción reactiva: cada vez que rolesSubject cambie, la tabla se actualiza
    this.dataService.roles$.subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  dataDelete: any;
  nameDelete: any;
  openModalDelete(ide: any, name: any) {
    console.log('ID a eliminar:', ide);
    this.dataDelete = ide;
    this.nameDelete = name; // Guarda el ID en una propiedad de la clase
    this.dialog.open(this.dialogDelete, { width: '400px', height: '400px', disableClose: true });
  }
  closedModalDelete() {
    this.form.reset();
    this.dialog.closeAll();
  }
  deleteData(): void {
    this.dataService.remove(this.dataDelete).subscribe({
      next: () => {
        console.log('Se eliminó correctamente');
        this.ActuallyTable(); // 👈 método único para refrescar
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
      },
    });
  }
  closedModalUpdate() {
    this.form.reset();
    this.dialog.closeAll();
  }

  dataUpdate: any;
  nameUpdate: any;
  openModalUpdate(ide: any, name: any) {
    console.log('ID a actualizar:', ide);
    this.dataUpdate = ide;
    this.dataSave.name = name; // Guarda el nombre en una propiedad de la clase
    this.dialog.open(this.dialogUpdate, { width: '400px' });
  }
  updateData() {
    if (this.form.valid) {
      this.dataService.update(this.dataUpdate, this.dataSave).subscribe({
        next: () => {
          this.initTable();
          this.closedModalUpdate();
          this.resetFilter();
          this.paginator.firstPage();
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      console.error(' Formulario no válido');
    }
  }
}
