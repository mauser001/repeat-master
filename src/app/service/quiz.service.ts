import { inject, Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, shareReplay, switchMap, take, tap } from 'rxjs';
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
  readonly #questionsByFilename: Record<string, Observable<Question[]>> = {}

  constructor() { }


  readonly #list$: Observable<ListResponse> = this.#http.get<ListResponse>('./list.json').pipe(
    catchError((e) => {
      console.log('error', e);
      return []
    }),
    take(1),
    shareReplay(1),
    map((data) => ({
      ...data,
      quizes: data.quizes.map((quiz) => {
        const questionIds: number[] = quiz.questionIds || []
        quiz.questionIdsMap?.split(',').forEach(part => {
          if (part.includes('-')) {
            const split = part.split('-').map((v) => parseInt(v));
            for (let i = split[0]; i <= split[1]; i++) {
              questionIds.push(i);
            }
          } else {
            questionIds.push(parseInt(part));
          }
        });

        return {
          ...quiz,
          questionIds
        }
      })
    })),
    tap((data) => {
      this.#progressService.getResults(data.quizes.map((q) => q.id));
      this.#progressService.getCompletedCount(data.quizes.map((q) => q.id));
    })
  )

  readonly getQuestions = (fileName: string): Observable<Question[]> => {
    if (this.#questionsByFilename[fileName]) {
      return this.#questionsByFilename[fileName];
    }

    const newList = this.#http.get<Question[]>(`./${fileName}`).pipe(
      take(1),
      shareReplay(1)
    );

    this.#questionsByFilename[fileName] = newList;

    return newList;
  }

  readonly quizes$: Observable<Quiz[]> = this.#list$.pipe(
    map((list) => list.quizes)
  )

  readonly getQuiz = (id: number): Observable<{ quiz?: Quiz, questions: Question[] }> => this.quizes$.pipe(
    map((quizes) => {
      return quizes.find((q) => q.id === id)
    }),
    filter((quiz) => !!quiz),
    switchMap((quiz) => {
      return forkJoin(quiz.files.split(',').map((fileName) => this.getQuestions(fileName))).pipe(
        map((totalQuestions) => {
          const questions = randomizeList(totalQuestions.flatMap((list) => list).filter((q) => quiz?.questionIds?.includes(q.id)))
          return {
            quiz,
            questions
          }
        })
      )
    })
  )
}
