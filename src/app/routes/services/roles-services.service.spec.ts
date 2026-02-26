import { TestBed } from '@angular/core/testing';

import { RolesServicesService } from './roles-services.service';

describe('RolesServicesService', () => {
  let service: RolesServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
