import { Component, computed, signal, Signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { FilterService } from '../../../service/filter.service';
import { Filter, FilterKey, FilterKeys } from '../../../models/filter.type';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'rep-header',
  standalone: true,
  imports: [MatIcon, NgIf, NgFor, TranslocoModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  filterKeys = FilterKeys;
  selectedFilter: Signal<Filter | undefined>;
  availableFilter: Signal<Filter | undefined>;
  isFilterShown = signal(false)

  constructor(private filterService: FilterService) {
    this.selectedFilter = toSignal(filterService.selectedFilter$)
    this.availableFilter = toSignal(filterService.availableFilter$)
  }

  setFilter(key: FilterKey, values: string[]) {
    console.log('setFilter', key, values)
    this.filterService.setFilterValues(key, values)
  }

  toggleFilter = () => {
    this.isFilterShown.set(!this.isFilterShown())
  }

  hasActiveFilter = computed(() =>
    this.filterKeys.some((key) => this.selectedFilter()?.[key].length))
}
