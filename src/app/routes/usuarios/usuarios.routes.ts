import { Routes } from '@angular/router';
import { UsuariosAddUsuarios } from './add-usuarios/add-usuarios';
import { UsuariosListUsuarios } from './list-usuarios/list-usuarios';

export const routes: Routes = [
  { path: 'add-usuarios', component: UsuariosAddUsuarios },
  { path: 'list-usuarios', component: UsuariosListUsuarios },
];
