import { PreventUnsavedChangesGuard } from './core/guards/prevent-unsaved-changes/prevent-unsaved-changes.guard';
import { MemberEditComponent } from './shared/components/members/member-edit/member-edit.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './shared/components/home/home.component';
import { ListsComponent } from './shared/components/lists/lists.component';
import { MemberDetailComponent } from './shared/components/members/member-detail/member-detail.component';
import { MemberListComponent } from './shared/components/members/member-list/member-list.component';
import { MessagesComponent } from './shared/components/messages/messages.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      {
        path: 'members/edit',
        component: MemberEditComponent,
        canDeactivate: [PreventUnsavedChangesGuard],
      },
      { path: 'members/:username', component: MemberDetailComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ],
  },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
