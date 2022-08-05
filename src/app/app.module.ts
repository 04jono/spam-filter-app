import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaillistComponent } from './maillist/maillist.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopHeaderComponent } from './top-header/top-header.component';

@NgModule({
  declarations: [
    AppComponent,
    MaillistComponent,
    SidebarComponent,
    TopHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
