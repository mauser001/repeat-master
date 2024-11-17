import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompletedCount, Results } from '../models/result.type';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  #results$ = new BehaviorSubject<Results>({});
  #completedCount$ = new BehaviorSubject<CompletedCount>({});

  constructor() { }

  results$ = this.#results$.asObservable();
  completedCount$ = this.#completedCount$.asObservable();

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

  increaseCompletedCount(quizId: number) {
    localStorage.setItem(this.#getCompletedCountKey(quizId), (this.#completedCount$.getValue()[quizId] + 1).toString());
  }

  getCompletedCount(quizIds: number[]) {
    const record: CompletedCount = {};
    this.#completedCount$.next(quizIds.reduce((total, quizId) => {
      const count = localStorage.getItem(this.#getCompletedCountKey(quizId));
      total[quizId] = count ? parseInt(count) : 0;
      return total;
    }, record))
  }

  #getQuizKey(quizId: number) {
    return `quiz-result-${quizId}`;
  }

  #getCompletedCountKey(quizId: number) {
    return `completed-count-${quizId}`;
  }
}
