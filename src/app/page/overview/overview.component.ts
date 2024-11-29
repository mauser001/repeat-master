import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { QuizService } from '../../service/quiz.service';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { Quiz } from '../../models/quiz.type';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CompletedCount, Results } from '../../models/result.type';
import { ProgressService } from '../../service/progress.service';

@Component({
  selector: 'rep-overview',
  standalone: true,
  imports: [MatCardModule, MatIcon, NgFor, NgIf, RouterModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {
  quizes: Signal<Quiz[]>
  results: Signal<Results>
  completedCount: Signal<CompletedCount>

  constructor(quizService: QuizService, resultService: ProgressService) {
    this.quizes = toSignal(quizService.quizes$, { initialValue: [] });
    this.results = toSignal(resultService.results$, { initialValue: {} });
    this.completedCount = toSignal(resultService.completedCount$, { initialValue: {} })
  }

  trackBy = (_index: number, quiz: Quiz) => quiz.id
}
