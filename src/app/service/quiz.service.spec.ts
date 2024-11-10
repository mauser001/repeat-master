import { TestBed } from '@angular/core/testing';

import { QuizService } from './quiz.service';

describe(QuizService.name, () => {
  let service: QuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
