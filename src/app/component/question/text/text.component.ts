import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Question } from '../../../models/question.type';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Answer } from '../../../models/answer.type';

@Component({
  selector: 'rep-question-text',
  standalone: true,
  imports: [NgIf, MatFormFieldModule, MatInputModule],
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent {
  question = input.required<Question>()
  onAnswers = output<Answer>();
  next = output<void>();

  onInputChange = (event: Event) => this.onAnswers.emit({ questionId: this.question().id, values: [(event.target as HTMLInputElement).value] });
}
