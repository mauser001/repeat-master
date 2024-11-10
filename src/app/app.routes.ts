import { Routes } from '@angular/router';
import { OverviewComponent } from './page/overview/overview.component';
import { QuizComponent } from './page/quiz/quiz.component';
import { ResultComponent } from './page/result/result.component';

export const routes: Routes = [
    {
        path: 'quiz/:id',
        title: (props) => `Quiz ${props.params['id']}`,
        component: QuizComponent
    },
    {
        path: 'result/:id',
        title: (props) => `Result ${props.params['id']}`,
        component: ResultComponent
    },
    {
        path: '',
        title: 'Repeat Master Quests',
        component: OverviewComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
