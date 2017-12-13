import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MineRngGameComponent } from './mine-rng-game/mine-rng-game.component';

@NgModule({
  declarations: [
    AppComponent,
    MineRngGameComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
