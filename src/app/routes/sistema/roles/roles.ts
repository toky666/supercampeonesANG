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
  OnDestroy,
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
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
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
export class SistemaRoles implements OnInit, AfterViewInit, OnDestroy {
  private _liveAnnouncer = inject(LiveAnnouncer);
  value = '';
  element = true;
  displayedColumns: string[] = ['nombre', 'action'];
  dataSource = new MatTableDataSource<any>();
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
  // Suscripción para transformar a mayúsculas this.dataForm.get('name')?.valueChanges.subscribe(val => { if (val) { this.dataForm.get('name')?.setValue(val.toUpperCase(), { emitEvent: false }); } });
  @ViewChild('dialogAdd') dialogAdd!: TemplateRef<any>;
  @ViewChild('dialogDelete') dialogDelete!: TemplateRef<any>;
  @ViewChild('dialogUpdate') dialogUpdate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  @ViewChild(MatSort) myMatSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  data: any[] = [];
  private destroy$ = new Subject<void>();
  pageSize = 5;
  pageIndex = 0;
  private dialog = inject(MatDialog);
  private dataService = inject(RolesServicesService);
  ngOnInit(): void {
    this.form.get('name')?.valueChanges.subscribe((val) => {
      if (val) {
        this.form.get('name')?.setValue(val.toUpperCase(), { emitEvent: false });
      }
    });

    if (this.searchControl.value && this.searchControl.value.trim().length > 0) {
      console.log('Está lleno');
      this.searchControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          map((value) => (value ?? '').trim()),
          takeUntil(this.destroy$),
        )
        .subscribe((safeValue) => {
          if (safeValue) {
            this.filter = safeValue;
            this.loadData(this.filter);
            console.log('SIIIIIII desde searchcontrol');
          }
        });
      /*
      this.searchControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((value) => {
          const safeValue = (value ?? '').trim(); // si es null, usa ''
          if (safeValue) {
            this.filter = safeValue;

            this.loadData(this.filter);
            console.log('SIIIIIII desde searchcontrol');
          } else {
            this.filter = '';
            this.dataSource.data = []; // o recargar todo
            console.log('Campo vacío, limpiando resultados');
          }
        });*/
    } else {
      console.log('Está vacío');
      this.dataSource = new MatTableDataSource<any>();
      // Consulta inicial al backend al entrar o recargar
      this.dataService
        .dataTablePagination({ limit: 5, offset: 0, query: {}, sort: { _id: -1 } })
        .subscribe(); // Suscripción reactiva a los datos

      this.dataService.roles$.subscribe((data) => {
        this.dataSource.data = data;
        console.log('desde ngafterviewinit 1111111111111');
      }); // Opcional: suscribirse al total de registros
      this.dataService.total$.subscribe((total) => {
        this.total = total;
      });
    }
  }

  form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required] }), // ahora es siempre string
  });
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngAfterViewInit() {
    /*
    //this.myMatSort.sort({ id: '', start: 'desc', disableClear: false });
    this.dataSource = new MatTableDataSource<any>();
    // Consulta inicial al backend al entrar o recargar
    this.dataService
      .dataTablePagination({ limit: 5, offset: 0, query: {}, sort: { _id: -1 } })
      .subscribe(); // Suscripción reactiva a los datos

    this.dataService.roles$.subscribe((data) => {
      this.dataSource.data = data;
      console.log('desde ngafterviewinit 1111111111111');
    }); // Opcional: suscribirse al total de registros
    this.dataService.total$.subscribe((total) => {
      this.total = total;
    });*/
  }
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
      this.data = res.data; // registros de la página
      this.total = res.count; // total
      this.dataSource.data = res.data; // refresca la tabla
      console.log('desde loaddata');
      console.log(this.dataSource.data);
      // this.dataService.dataTablePagination(query).subscribe();
    });
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
      this.data = res.data; // registros de la página
      this.total = res.count; // total

      this.dataSource.data = res.data; // refresca la tabla

      console.log('desde loaddata');
      console.log(this.dataSource.data);

      // this.dataService.dataTablePagination(query).subscribe();
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
      this.data = res.data; // registros de la página
      this.total = res.count; // total
      this.dataSource.data = res.data; // refresca la tabla
      console.log('desde loaddata');
      console.log(this.dataSource.data);
      // this.dataService.dataTablePagination(query).subscribe();
    });
  }
  // Método que carga datos desde el backend
  loadData(filterValue = '') {
    switch (this.myMatSort.direction) {
      case 'asc':
        this.filterAsc(filterValue);
        console.log('************ENTRO ASC******************');
        break;
      case 'desc':
        this.filterDesc(filterValue);
        console.log('************ENTRO DESC******************');
        break;
      case '':
        this.filterNormal(filterValue);
        console.log('************ENTRO NORMAL******************');
        break;
      default:
        console.log('MAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLL');
        break;
    }

    //this.table.renderRows();
    /*  if (filterValue.length > 0) {
        ESTA BIEN ESTE CODIGOOO NO ELIMINAR***********
      if (this.myMatSort.direction == '') {
        //let sortObj: Record<string, number> = { createdAt: -1 };
        let sortObj: Record<string, number> = { name: 1 };  // de primero al ultimo
        //let sortObj: Record<string, number> = { name: -1 };  // de ultimo al primero orden
        if (
          this.myMatSort?.active &&
          this.myMatSort.active.trim() !== '' &&
          this.myMatSort.direction
        ) {
          sortObj = { [this.myMatSort.active]: this.myMatSort.direction === 'desc' ? -1 : 1 };
        }

        const query = {
          limit: this.pageSize,
          offset: this.pageIndex * this.pageSize,
          query: filterValue ? { name: filterValue } : {},
          sort: sortObj,
        };
        this.dataService.doFilter(query).subscribe((res) => {
          this.data = res.data; // registros de la página
          this.total = res.count; // total
          this.dataSource.data = res.data; // refresca la tabla
          console.log('desde loaddata');
          console.log(this.dataSource.data);

          // this.dataService.dataTablePagination(query).subscribe();
        });
      }
    }*/
    /*else {
      // Suscripción reactiva: cada vez que rolesSubject cambie, la tabla se actualiza
      this.dataService.roles$.subscribe((data) => {
        this.dataSource.data = data;
        console.log('desde loaddata DE DATASOURCE');
        console.log(this.dataSource.data);
      });
    }*/
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
        console.log('OTRA MANERA 1');
      }

      if (this.sortBandera == 2) {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: -1 },
        };
        console.log('OTRA MANERA 2');
      }

      if (this.sortBandera == 3) {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { createdAt: -1 },
        };
        console.log('OTRA MANERA 3');
      }
      this.loadData(this.filter);
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
        console.log('BANDERA DE ONSORT SOLO FILTER');
        console.log(this.sortBandera);
      }
      if (!this.myMatSort.active || this.myMatSort.direction === 'desc') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { name: -1 },
        };
        this.sortBandera = 2;
        console.log('BANDERA DE ONSORT SOLO FILTER');
        console.log(this.sortBandera);
      }
      if (!this.myMatSort.active || this.myMatSort.direction === '') {
        this.query = {
          limit: this.total,
          offset: (this.page - 1) * this.limit,
          query: { name: this.filter },
          sort: { createdAt: -1 },
        };
        this.sortBandera = 3;
        console.log('BANDERA DE ONSORT SOLO FILTER');
        console.log(this.sortBandera);
      }

      //this.changeFilter();
      this.loadData(this.filter);
      return;
    } else {
      console.log('NO entro');
      if (!this.myMatSort.active || this.myMatSort.direction === 'asc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
        this.sortBandera = 1;
        console.log('BANDERA DE ONSORT SIN FILTER');
        console.log(this.sortBandera);
      }
      if (!this.myMatSort.active || this.myMatSort.direction === 'desc') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
        this.sortBandera = 2;
        console.log('BANDERA DE ONSORT SIN FILTER');
        console.log(this.sortBandera);
      }
      if (!this.myMatSort.active || this.myMatSort.direction === '') {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
        this.sortBandera = 3;
        console.log('BANDERA DE ONSORT SIN FILTER');
        console.log(this.sortBandera);
      }
      //this.changeFilter();
      this.ActuallyTable(); // recarga datos con el nuevo orden
      return;
    }

    // recarga datos con el nuevo orden
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
    console.log('desde inittable');
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
      if (this.sortBandera == 3) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
        console.log('ENTRA PAGECHEANGED');
        console.log(this.sortBandera);
      }
      if (this.sortBandera == 1) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
        console.log('ENTRA PAGECHEANGED');
        console.log(this.sortBandera);
      }
      if (this.sortBandera == 2) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
        console.log('ENTRA PAGECHEANGED');
        console.log(this.sortBandera);
      }
      this.loadData(this.filter); // usa el filtro actual
    } else {
      if (this.sortBandera == 3) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
        console.log('ENTRA PAGECHEANGED');
        console.log(this.sortBandera);
      }
      if (this.sortBandera == 1) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
        console.log('ENTRA PAGECHEANGED');
        console.log(this.sortBandera);
      }
      if (this.sortBandera == 2) {
        this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
        console.log('ENTRA PAGECHEANGED');
        console.log(this.sortBandera);
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
      this.loadData(this.query);
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
      this.ActuallyTable();
      return;
    }
  }

  /*************************************************************************************************/
  ActuallyTable() {
    this.dataService.dataTablePagination(this.query).subscribe();
    // Suscripción reactiva: cada vez que rolesSubject cambie, la tabla se actualiza
  }

  clearSearch() {
    this.searchControl.setValue('');
    //this.doFilter(''); // opcional: refresca la tabla sin filtro
    //this.paginator.firstPage();
    //this.initTable();
    this.sortBandera = 3;
    this.pageIndex = 0; // reinicia a la primera página
    this.pageSize = 5; // valor por defecto (puedes cambiarlo)v
    this.paginator.firstPage();
    // 🔑 Reset del sort (quita flecha)
    this.myMatSort.active = '';
    this.myMatSort.direction = '';
    this.myMatSort.sortChange.emit({ active: '', direction: '' });
    this.dataService
      .dataTablePagination({ limit: 5, offset: 0, query: {}, sort: { _id: -1 } })
      .subscribe();
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
        this.ActuallyTable();
        alertify.success('Se elimino correctamente');
      },
      error: () => {
        alertify.error('Se desconecto el servidor');
      },
    });
  }

  openModalDelete(ide: any, name: any) {
    this.dataDelete = ide;
    this.nameDelete = name;
    this.clearSearch();
    this.dialog.open(this.dialogDelete, { width: '400px', height: '400px', disableClose: true });
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

  openModalUpdate(ide: any, name: any) {
    this.dataUpdate = ide;
    this.dataSave.name = name;
    //this.clearSearch();
    this.dialog.open(this.dialogUpdate, { width: '400px', disableClose: true });
  }

  saveData() {
    if (this.form.valid) {
      this.dataService.save(this.form.value as rolesInterfaz).subscribe({
        next: () => {
          this.ActuallyTable();
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
      this.dataService.update(this.dataUpdate, this.dataSave).subscribe({
        next: (res) => {
          if (this.filter.length > 0) {
            if (res.pageIndex !== undefined) {
              this.pageIndex = res.pageIndex;
              const prueba = this.pageIndex;
              console.log('seraaa q entraaa');
              console.log(prueba);
            }
            this.loadData(this.filter);
            this.closedModal();
            //this.clearSearch();
          } else {
            // 🔑 Reaplicar sort después de refrescar datos

            this.ActuallyTable();
            this.closedModal();
          }
          this.dataSource.sort = this.myMatSort;
          this.myMatSort.active = 'id';

          if (this.myMatSort.direction == 'asc') {
            this.myMatSort.direction = 'asc'; // o 'desc'
            //this.myMatSort.sortChange.emit({ active: 'id', direction: 'asc' });
            this.dataSource.sort = this.myMatSort;
          }
          if (this.myMatSort.direction == 'desc') {
            this.myMatSort.direction = 'desc'; // o 'desc'
            //his.myMatSort.sortChange.emit({ active: 'id', direction: 'desc' });
            this.dataSource.sort = this.myMatSort;
          }
          if (this.myMatSort.direction == '') {
            this.myMatSort.direction = ''; // o 'desc'
            //this.myMatSort.sortChange.emit({ active: 'id', direction: '' });
            this.dataSource.sort = this.myMatSort;
          }
          this.table.renderRows();
          alertify.success('Se modifico correctamente');
          //this.clearSearch();
        },
        error: () => {
          alertify.error('Se desconecto el servidor');
        },
      });
    } else {
      alertify.info('formulario no valido');
    }
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
        console.log('desde changetable');
        console.log(this.dataSource.data);
      },
      (err) => {
        alertify.error('Se desconecto el servidor de la lista');
      },
    );
  }
  showData() {
    return (this.element = true);
  }

  dataDelete: any;
  nameDelete: any;

  dataUpdate: any;
  nameUpdate: any;
}
