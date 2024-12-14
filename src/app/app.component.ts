import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundComponent } from "./component/background/background.component";

@Component({
  selector: 'rep-root',
  standalone: true,
  imports: [RouterOutlet, BackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'RepeatMaster';
}
