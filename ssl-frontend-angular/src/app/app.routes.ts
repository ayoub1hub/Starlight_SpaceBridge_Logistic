import { Routes } from '@angular/router';
import { App } from './app';
import { TestsComponent } from './tests/tests';

export const routes: Routes = [
  {
    path: '',
    component: App   // Landing page
  },
  {
    path: 'tests',
    component: TestsComponent // Page de tests
  },
  {
    path: '**',
    redirectTo: ''
  }
];
