import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home-landing.page').then((module) => module.HomeLandingPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('./docs-layout.component').then((module) => module.DocsLayoutComponent),
    children: [
      { path: 'overview', loadComponent: () => import('./pages/docs-overview.page').then((module) => module.DocsOverviewPageComponent) },
      { path: 'quickstart', loadComponent: () => import('./pages/docs-quickstart.page').then((module) => module.DocsQuickstartPageComponent) },
      { path: 'pwa', loadComponent: () => import('./pages/docs-pwa.page').then((module) => module.DocsPwaPageComponent) },
      { path: 'llms', loadComponent: () => import('./pages/docs-llms.page').then((module) => module.DocsLlmsPageComponent) },
      { path: 'components', loadComponent: () => import('./pages/docs-components.page').then((module) => module.DocsComponentsPageComponent) },
      { path: 'components/:slug', loadComponent: () => import('./pages/docs-component-detail.page').then((module) => module.DocsComponentDetailPageComponent) },
      { path: 'api', loadComponent: () => import('./pages/docs-api.page').then((module) => module.DocsApiPageComponent) },
      { path: 'api/:slug', loadComponent: () => import('./pages/docs-api-detail.page').then((module) => module.DocsApiDetailPageComponent) },
      { path: 'guides', loadComponent: () => import('./pages/docs-guides.page').then((module) => module.DocsGuidesPageComponent) },
      { path: 'release', loadComponent: () => import('./pages/docs-release.page').then((module) => module.DocsReleasePageComponent) },
      { path: 'docs/:slug', loadComponent: () => import('./pages/docs-content-detail.page').then((module) => module.DocsContentDetailPageComponent) },
      { path: 'search', loadComponent: () => import('./pages/docs-search.page').then((module) => module.DocsSearchPageComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
