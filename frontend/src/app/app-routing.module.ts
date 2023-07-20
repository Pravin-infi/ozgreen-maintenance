import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewIssuesComponent } from './components/new-issues/new-issues.component';
import { LogIssuesComponent } from './components/log-issues/log-issues.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { UserlistComponent } from './components/userlist/userlist.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'home', component: HomeComponent},
  {path: 'userlist', component: UserlistComponent},
  {path: 'authentication', component: AuthenticationComponent},
  {path: 'new', component: NewIssuesComponent},
  {path: 'logIssue/:id', component: LogIssuesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
