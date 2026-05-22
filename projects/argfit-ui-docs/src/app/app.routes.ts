import { Routes } from '@angular/router';

import { DocsApiPageComponent } from './pages/docs-api.page';
import { DocsComponentsPageComponent } from './pages/docs-components.page';
import { DocsGuidesPageComponent } from './pages/docs-guides.page';
import { DocsOverviewPageComponent } from './pages/docs-overview.page';
import { DocsReleasePageComponent } from './pages/docs-release.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', component: DocsOverviewPageComponent },
  { path: 'components', component: DocsComponentsPageComponent },
  { path: 'api', component: DocsApiPageComponent },
  { path: 'guides', component: DocsGuidesPageComponent },
  { path: 'release', component: DocsReleasePageComponent },
  { path: '**', redirectTo: 'overview' },
];
