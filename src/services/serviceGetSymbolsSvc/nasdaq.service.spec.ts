import { TestBed } from '@angular/core/testing';

import { NasdaqService } from './nasdaq.service';

describe('NasdaqService', () => {
  let service: NasdaqService;

  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NasdaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
