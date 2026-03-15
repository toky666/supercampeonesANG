import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeader } from '@shared';

import { UsuariosListUsuarios } from './list-usuarios';

describe('UsuariosListUsuarios', () => {
  let component: UsuariosListUsuarios;
  let fixture: ComponentFixture<UsuariosListUsuarios>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PageHeader]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosListUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
