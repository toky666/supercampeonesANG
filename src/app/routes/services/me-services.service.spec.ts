import { TestBed } from '@angular/core/testing';

import { MeServicesService } from './me-services.service';

describe('MeServicesService', () => {
  let service: MeServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
