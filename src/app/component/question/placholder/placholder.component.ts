import { ChangeDetectionStrategy, Component, input, output, computed, signal, effect } from '@angular/core';
import { Question } from '../../../models/question.type';
import { Answer } from '../../../models/answer.type';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'rep-placholder',
  standalone: true,
  imports: [NgIf, NgFor, MatFormFieldModule, MatInputModule],
  templateUrl: './placholder.component.html',
  styleUrl: './placholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlacholderComponent {

  question = input.required<Question>()
  onAnswers = output<Answer>();
  next = output<void>();

  answers = signal<string[]>([])

  parts = computed(() => {
    const question = this.question();
    const answers = question.correctAnswers.split('|');
    const text = question.text ?? '';
    const split = text.split('_');
    const merged: { isPlaceholder: boolean, index?: number, width?: number, text?: string }[] = [];
    const totalAnswers = answers.length;
    let anserCount = 0;

    if (text?.charAt(0) === '_') {
      merged.push({ isPlaceholder: true, index: 0, width: answers[anserCount]?.length * 7 })
      anserCount++;
    }
    for (var i = 0; i < split.length; i++) {
      merged.push({ isPlaceholder: false, text: split[i] })
      if (anserCount < totalAnswers) {
        merged.push({ isPlaceholder: true, index: anserCount, width: answers[anserCount]?.length * 7 })
        anserCount++;
      }
    }
    console.log('computed', text, merged)
    return merged
  })

  onInputChange = (event: Event, index: number) => {
    const newAnswers = this.question().correctAnswers.split('|').map((_, i) => {
      if (index === i) {
        return (event.target as HTMLInputElement).value
      }
      return this.answers()[i] ?? ''
    })
    console.log('input', newAnswers, this.answers())
    this.answers.set(newAnswers)

    this.onAnswers.emit({ questionId: this.question().id, values: newAnswers })
  }
}
