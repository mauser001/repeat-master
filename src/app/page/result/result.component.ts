import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../service/quiz.service';
import { ProgressService } from '../../service/progress.service';

@Component({
  selector: 'rep-result',
  standalone: true,
  imports: [],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent {
  /*  #results: Signal<{total: number, correct: number}>
  
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
    })*/
}
