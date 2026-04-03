import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private idrol: string | null = null;
  

  setIdRol(id: string) {
    this.idrol = id;
  }

  getIdRol(): string | null {
    return this.idrol;
  }
}
