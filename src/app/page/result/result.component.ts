import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuizService } from '../../service/quiz.service';
import { ProgressService } from '../../service/progress.service';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { map, switchMap, tap, withLatestFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Question } from '../../models/question.type';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';

type CompleteState = 'wrong' | 'partial' | 'complete'

@Component({
  selector: 'rep-result',
  standalone: true,
  imports: [
    MatCardModule,
    MatIcon,
    MatFabButton,
    NgFor, NgIf,
    RouterModule,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent {
  #router: Router;
  #progressService: ProgressService;
  result$: Signal<{
    total: number,
    completed: number,
    state: CompleteState,
    questions: Question[],
    completedIds: number[],
  } | undefined>
  #id: number = -1;

  constructor(route: ActivatedRoute, quizService: QuizService, progressService: ProgressService, router: Router) {
    this.#router = router;
    this.#progressService = progressService
    this.result$ = toSignal(
      route.params.pipe(
        map((params) => parseInt(params['id'])),
        tap((id) => this.#id = id),
        switchMap((id) =>
          quizService.getQuiz(id).pipe(
            withLatestFrom(progressService.results$),
            map(([quiz, results]) => {
              console.log('quiz, comp', quiz, results)
              let state: CompleteState = 'wrong';
              if (!quiz.quiz) {
                return undefined
              }
              const questions = quiz.questions;
              const total = questions.length;
              const completedIds = results[quiz.quiz.id] || [];
              const completed = completedIds.length;
              if (completed > 0) {
                state = completed >= total ? 'complete' : 'partial';
              }
              return {
                questions,
                completedIds,
                total,
                completed,
                state
              }
            })
          )),
      ),
    );
  }

  retry = () => {
    if (this.result$()?.state === 'complete') {
      this.#progressService.updateResult(this.#id, []);
    }
    this.#router.navigateByUrl(`quiz/${this.#id}`);
  }

  trackBy = (_index: number, question: Question) => question.id
}
