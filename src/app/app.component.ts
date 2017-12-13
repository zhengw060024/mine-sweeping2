import { Component } from '@angular/core';
import { MineGameState } from './mine-rng-game/mine-rng-interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sao lei';
  setGameState(gameState: MineGameState) {
    if (gameState === MineGameState.GameStateEndSuccess) {
      this.title = 'you win!!!';
    } else if (gameState === MineGameState.GameStateEndFailed) {
      this.title = 'you failed';
    }
  }
}
