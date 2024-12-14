import { NgFor } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'rep-background',
  standalone: true,
  imports: [NgFor],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class BackgroundComponent implements OnDestroy {
  selectedIndex = signal<number[]>(this.#randomList());

  readonly #interval = setInterval(() => {
    this.selectedIndex.set(this.#randomList());
  }, 20000);

  #randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  #randomList() {
    return [...Array(10).keys()].map(() => this.#randomIntFromInterval(0, 100));
  }

  ngOnDestroy(): void {
    clearInterval(this.#interval)
  }
}
