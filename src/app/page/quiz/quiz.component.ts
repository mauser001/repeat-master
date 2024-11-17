import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Quiz } from '../../models/quiz.type';
import { Question } from '../../models/question.type';
import { QuizService } from '../../service/quiz.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { TextComponent } from '../../component/question/text/text.component';
import { MatCardModule } from '@angular/material/card';
import { Answer } from '../../models/answer.type';
import { ProgressService } from '../../service/progress.service';
import { Results } from '../../models/result.type';
import { union } from 'lodash-es';
import { validateAnswers } from '../../utils/quiz';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CdkPortal, CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { PlacholderComponent } from '../../component/question/placholder/placholder.component';
import { randomizeList, randomizeText } from '../../utils/randomize';

@Component({
  selector: 'rep-quiz',
  standalone: true,
  imports: [
    MatCardModule,
    MatStepperModule,
    MatIconModule,
    MatIcon,
    MatFabButton,
    CdkPortal,
    CdkPortalOutlet,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    RouterModule,
    NgSwitchDefault,
    TextComponent,
    PlacholderComponent
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    }
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizComponent {
  private _viewContainerRef = inject(ViewContainerRef);

  @ViewChild('actionButtonsContent') actionButtonsContent?: TemplateRef<unknown>;
  #progressService: ProgressService;
  #router: Router;
  #results: Signal<Results>

  data: Signal<{
    quiz?: Quiz,
    questions: Question[]
  } | undefined>

  selectedIndex = signal(0)

  answers = signal<Record<number, string[]>>({})
  actionButtonsPortal?: TemplatePortal<any>;

  constructor(route: ActivatedRoute, quizService: QuizService, progressService: ProgressService, router: Router) {

    this.#progressService = progressService;
    this.#router = router;
    this.data = toSignal(
      route.params.pipe(
        switchMap((params) => quizService.getQuiz(parseInt(params['id']))))
    );
    this.#results = toSignal(progressService.results$, { initialValue: {} });
  }

  animationDone() {
    if (!this.actionButtonsPortal) {
      this.actionButtonsPortal = new TemplatePortal(this.actionButtonsContent!, this._viewContainerRef);
    }
  }

  indexChanged(index: number) {
    this.selectedIndex.set(index);
  }

  openQuestions = computed(() => {
    const results = this.#results()
    const quiz = this.data()?.quiz
    if (!quiz) {
      return []
    }
    const filtered = this.data()?.questions.filter((question) => !results[quiz.id].includes(question.id)) || []

    return filtered.map((q) => ({
      ...q,
      hints: this.getHints(q)
    }))
  })



  getHints(question: Question) {
    if (!question.hint) {
      return
    }
    const mixed = randomizeList(question.correctAnswers.split('|'));
    return mixed.map((answer) => randomizeText(answer)).join(', ');
  }

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
    this.#router.navigateByUrl(`result/${quiz.id}`)
  }

  trackBy = (_index: number, question: Question) => question.id
}
