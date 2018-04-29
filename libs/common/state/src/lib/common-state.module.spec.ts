import { async, TestBed } from '@angular/core/testing';
import { CommonStateModule } from './common-state.module';

describe('CommonStateModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [CommonStateModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CommonStateModule).toBeDefined();
  });
});
