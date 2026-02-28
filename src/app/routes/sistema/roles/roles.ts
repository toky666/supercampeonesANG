import {
  ChangeDetectionStrategy,
  AfterViewInit,
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

import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
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
  ],
  templateUrl: './roles.html',
  standalone: true,
  styleUrl: './roles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SistemaRoles implements OnInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['nombre', 'action'];
  dataSource: any;
  public page = 1;
  public total = 0;
  public query: any = {};
  public limit = 10;
  sortBandera = 3;
  filter: any = '';
  offset = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  private dialog = inject(MatDialog);
  private dataService = inject(RolesServicesService);
  ngOnInit(): void {
    this.initTable();
    this.dataSource.sort = this.sort;
    this.initTable();
  }


  form = new FormGroup({
    name: new FormControl<string>(''), // ahora es siempre string
  });

  openDialog() {
    this.dialog.open(this.dialogTemplate, { width: '400px' });
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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

  initTable() {
    this.limit = 10;
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
    if (this.sortBandera == 3) {
      this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { _id: -1 } };
    }
    if (this.sortBandera == 1) {
      this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: 1 } };
    }
    if (this.sortBandera == 2) {
      this.query = { limit: this.limit, offset: this.offset, query: {}, sort: { name: -1 } };
    }
    this.changeFilter();
    this.changeTable(this.query);
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
}
