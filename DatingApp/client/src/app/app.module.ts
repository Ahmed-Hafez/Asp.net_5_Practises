import { MessagesComponent } from './shared/components/messages/messages.component';
import { MemberMessagesComponent } from './shared/components/members/member-messages/member-messages.component';
import { ListsComponent } from './shared/components/lists/lists.component';
import { MemberDetailComponent } from './shared/components/members/member-detail/member-detail.component';
import { MemberListComponent } from './shared/components/members/member-list/member-list.component';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './shared/components/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HomeComponent } from './shared/components/home/home.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { MemberCardComponent } from './shared/components/member-card/member-card.component';
import { ErrorInterceptor } from './core/interceptors/error/error.interceptor';
import { JwtInterceptor } from './core/interceptors/jwt/jwt.interceptor';
import { MemberEditComponent } from './shared/components/members/member-edit/member-edit.component';
import { LoadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { PhotoEditorComponent } from './shared/components/photo-editor/photo-editor.component';
import { DateInputComponent } from './shared/components/forms/date-input/date-input.component';
import { InputComponent } from './shared/components/forms/input/input.component';
import { CastPipe } from './shared/pipes/cast.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberListComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    ListsComponent,
    PhotoEditorComponent,
    InputComponent,
    DateInputComponent,
    CastPipe,
    MemberMessagesComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
