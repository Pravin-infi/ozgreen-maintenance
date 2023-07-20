import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatDialogModule } from "@angular/material/dialog"
import { MatSelectModule } from "@angular/material/select"
import { MatCheckboxModule} from "@angular/material/checkbox"
import { FormsModule ,ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './components/home/home.component';
import { DataTablesModule } from 'angular-datatables';
import { NewIssuesComponent } from './components/new-issues/new-issues.component';
import { DatePipe, NgFor } from '@angular/common';
import { InterceptorInterceptor } from './interceptor/interceptor.interceptor';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { WebcamModule } from 'ngx-webcam';
import { HeaderComponent } from './components/header/header.component';
import { LogIssuesComponent } from './components/log-issues/log-issues.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { UserlistComponent } from './components/userlist/userlist.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NewIssuesComponent,
    HeaderComponent,
    LogIssuesComponent,
    RegistrationComponent,
    AuthenticationComponent,
    UserlistComponent
  ],
  imports: [
    MatInputModule,    
    ToastrModule.forRoot(),
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),
    WebcamModule,
    MatAutocompleteModule,
    BsDatepickerModule.forRoot(),
    MatNativeDateModule,
    MatDatepickerModule,
    NgFor,
    
  ],
  providers: [DatePipe, 
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
