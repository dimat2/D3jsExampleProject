import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { UsersComponent } from './users/users.component';
import { EngagementComponent } from './engagement/engagement.component';
import { CountriesComponent } from './countries/countries.component';
import { TrendComponent } from './trend/trend.component';

import { DchgComponent } from './dchg/dchg.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    EngagementComponent,
    CountriesComponent,
    TrendComponent,
    DchgComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
