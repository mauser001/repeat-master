import { NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'rep-footer',
  standalone: true,
  imports: [TranslocoModule, NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  isDisclaimerShown = signal(false)

  toggleDisclaimer = () => {
    this.isDisclaimerShown.set(!this.isDisclaimerShown())
  }
}
