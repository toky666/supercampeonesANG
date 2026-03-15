import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeader } from '@shared';

import { UsuariosAddUsuarios } from './add-usuarios';

describe('UsuariosAddUsuarios', () => {
  let component: UsuariosAddUsuarios;
  let fixture: ComponentFixture<UsuariosAddUsuarios>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PageHeader]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosAddUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
