import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Results } from '../models/result.type';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  #results$ = new BehaviorSubject<Results>({});

  constructor() { }

  results$ = this.#results$.asObservable();

  updateResult(quizId: number, correctQuestionIds: number[]) {
    localStorage.setItem(this.#getQuizKey(quizId), JSON.stringify(correctQuestionIds));
    this.#results$.next({ ...this.#results$.getValue(), [quizId]: correctQuestionIds })
  }

  getResults(quizIds: number[]) {
    const record: Results = {};
    this.#results$.next(quizIds.reduce((total, quizId) => {
      const result = localStorage.getItem(this.#getQuizKey(quizId));
      total[quizId] = result ? JSON.parse(result) : [];
      return total;
    }, record))
  }

  #getQuizKey(quizId: number) {
    return `quiz-result-${quizId}`;
  }
}
