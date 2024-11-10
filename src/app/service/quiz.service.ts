import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, tap } from 'rxjs';
import { Quiz } from '../models/quiz.type';
import { HttpClient } from '@angular/common/http';
import { ListResponse } from '../models/list-response.type';
import { Question } from '../models/question.type';
import { randomizeList } from '../utils/randomize';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  readonly #http = inject(HttpClient)
  readonly #progressService = inject(ProgressService);

  constructor() { }


  readonly #list$: Observable<ListResponse> = this.#http.get<ListResponse>('./list.json').pipe(
    catchError((e) => {
      console.log('error', e);
      return []
    }),
    shareReplay(1),
    tap((data) => this.#progressService.getResults(data.quizes.map((q) => q.id)))
  )

  readonly quizes: Observable<Quiz[]> = this.#list$.pipe(
    map((list) => list.quizes)
  )

  readonly getQuiz = (id: number): Observable<{ quiz?: Quiz, questions: Question[] }> => this.#list$.pipe(
    map((list) => {
      console.log('id', id, typeof id)
      const quiz = list.quizes.find((q) => q.id === id)
      const questions = randomizeList(list.questions.filter((q) => quiz?.questionIds.includes(q.id)))
      console.log('questions', questions)
      return {
        quiz,
        questions
      }
    })
  )
}
