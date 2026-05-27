import { Routes } from '@angular/router';

import { DeviceDemoPage } from './pages/device-demo/device-demo.page';
import { InstallPage } from './pages/install/install.page';
import { OfflinePage } from './pages/offline/offline.page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'device',
  },
  {
    path: 'device',
    component: DeviceDemoPage,
    title: 'Device demo',
  },
  {
    path: 'install',
    component: InstallPage,
    title: 'Install and updates',
  },
  {
    path: 'offline',
    component: OfflinePage,
    title: 'Offline shell',
  },
  {
    path: '**',
    redirectTo: 'device',
  },
];
