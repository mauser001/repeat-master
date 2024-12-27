import { inject, Injectable } from '@angular/core';
import { QuizService } from './quiz.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Filter, FilterKey, FilterKeys, newFilter } from '../models/filter.type';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  readonly #quizService: QuizService = inject(QuizService);
  readonly #selectedFilter$: BehaviorSubject<Filter> = new BehaviorSubject(newFilter());

  constructor() {
    const fromStorage = localStorage.getItem('filter')
    const filter: Filter = fromStorage ? JSON.parse(fromStorage) : newFilter()
    this.#selectedFilter$.next(filter)
  }

  availableFilter$ = this.#quizService.quizes$.pipe(
    map((quizes) => {
      const base = newFilter();
      return quizes.reduce((filter, quiz) => {
        FilterKeys.forEach((key) => {
          if (!filter[key].includes(quiz[key])) {
            filter[key].push(quiz[key]);
          }
        })
        return filter
      }, base)
    })
  )

  selectedFilter$ = this.#selectedFilter$.asObservable();

  filteredQuizes$ = combineLatest([this.#quizService.quizes$, this.#selectedFilter$, this.availableFilter$]).pipe(
    map(([quizes, selectedFilter, availableFitler]) => quizes.filter((quiz) => {
      return FilterKeys.every((key) => availableFitler[key].length < 2 || !selectedFilter[key].length || selectedFilter[key].includes(quiz[key]))
    }))
  )

  setFilterValues(key: FilterKey, values: string[]) {
    const newFilter = {
      ...this.#selectedFilter$.value,
      [key]: values
    }
    this.#selectedFilter$.next(newFilter);
    localStorage.setItem('filter', JSON.stringify(newFilter))
  }
}
