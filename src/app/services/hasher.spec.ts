import { TestBed } from '@angular/core/testing';

import { Hasher } from './hasher';

describe('Hasher', () => {
  let service: Hasher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hasher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
