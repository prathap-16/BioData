import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PageViewComponent } from './page-view/page-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule   
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
