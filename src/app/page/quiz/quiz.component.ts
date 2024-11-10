import { ChangeDetectionStrategy, Component, computed, signal, Signal } from '@angular/core';
import { Quiz } from '../../models/quiz.type';
import { Question } from '../../models/question.type';
import { QuizService } from '../../service/quiz.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { TextComponent } from '../../component/question/text/text.component';
import { MatCardModule } from '@angular/material/card';
import { Answer } from '../../models/answer.type';
import { ProgressService } from '../../service/progress.service';
import { Results } from '../../models/result.type';
import { union } from 'lodash-es';
import { validateAnswers } from '../../utils/quiz';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';

@Component({
  selector: 'rep-quiz',
  standalone: true,
  imports: [
    MatCardModule,
    MatStepperModule,
    MatIcon,
    MatFabButton,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    RouterModule,
    NgSwitchDefault,
    TextComponent
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizComponent {
  #progressService: ProgressService
  #results: Signal<Results>

  data: Signal<{
    quiz?: Quiz,
    questions: Question[]
  } | undefined>

  answers = signal<Record<number, string[]>>({})


  constructor(route: ActivatedRoute, quizService: QuizService, progressService: ProgressService) {
    this.#progressService = progressService
    this.data = toSignal(
      route.params.pipe(
        switchMap((params) => quizService.getQuiz(parseInt(params['id']))))
    );
    this.#results = toSignal(progressService.results$, { initialValue: {} });
  }

  openQuestions = computed(() => {
    const results = this.#results()
    const quiz = this.data()?.quiz
    if (!quiz) {
      return []
    }
    return this.data()?.questions.filter((question) => !results[quiz.id].includes(question.id)) || []
  })

  updateAnswer = (answer: Answer) => {
    const newRecord = { ...this.answers() };
    newRecord[answer.questionId] = answer.values;
    this.answers.set(newRecord)
  }

  finish = () => {
    const results = this.#results()
    const quiz = this.data()?.quiz
    const questions = this.data()?.questions || []
    if (!quiz) {
      return
    }
    const answers = this.answers();
    const correctAnswers: number[] = Object.entries(answers).filter(([key, answers]) => {
      const question = questions.find((q) => q.id === Number(key))
      return question && validateAnswers(question, answers)
    }).map(([key]) => Number(key))

    this.#progressService.updateResult(quiz.id, union<number>(results[quiz.id], correctAnswers))
  }

  trackBy = (_index: number, question: Question) => question.id
}
