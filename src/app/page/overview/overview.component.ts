import { ChangeDetectionStrategy, Component, signal, Signal } from '@angular/core';
import { QuizService } from '../../service/quiz.service';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { Quiz } from '../../models/quiz.type';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CompletedCount, Results } from '../../models/result.type';
import { ProgressService } from '../../service/progress.service';
import { TranslocoModule } from '@jsverse/transloco';
import { FilterService } from '../../service/filter.service';
import { HeaderComponent } from "../../component/overview/header/header.component";

@Component({
  selector: 'rep-overview',
  standalone: true,
  imports: [MatCardModule, MatIcon, NgFor, NgIf, RouterModule, TranslocoModule, HeaderComponent, HeaderComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {
  quizes: Signal<Quiz[]>
  results: Signal<Results>
  completedCount: Signal<CompletedCount>

  constructor(filterService: FilterService, resultService: ProgressService) {
    this.quizes = toSignal(filterService.filteredQuizes$, { initialValue: [] });
    this.results = toSignal(resultService.results$, { initialValue: {} });
    this.completedCount = toSignal(resultService.completedCount$, { initialValue: {} })
  }

  trackBy = (_index: number, quiz: Quiz) => quiz.id

}
