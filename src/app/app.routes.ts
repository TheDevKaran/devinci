import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { DoodleTool } from './doodle-tool/doodle-tool';
import { AdminPanel } from './admin-panel/admin-panel';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },   // Landing Page
  { path: 'app', component: DoodleTool }, // Main Tool
  // { path: '**', redirectTo: '' },
  {
  path: 'admin',
  component: AdminPanel,
  canActivate: [AdminGuard]
}

];
