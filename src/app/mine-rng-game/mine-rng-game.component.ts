import { Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { MineRngAgular } from './mine-rng-agular';
import { MineGameState } from './mine-rng-interface';
import { EventEmitter } from '@angular/core';
enum GameType {
  game_Nest = 1,
  game_Sque = 2,
  game_Triangle = 3,
  game_Random = 4
}
@Component({
  selector: 'app-mine-rng-game',
  templateUrl: './mine-rng-game.component.html',
  styleUrls: ['./mine-rng-game.component.css']
})

export class MineRngGameComponent implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Output() gameStateResult: EventEmitter<MineGameState>;
  private m_dataGame: MineRngAgular;
  private m_GameType: GameType;

  constructor() {
    this.m_GameType = 1;
    this.gameStateResult = new EventEmitter();
  }
  changeGameType($event) {
    this.m_GameType = parseInt($event.target.value , 10) ;
    console.log(this.m_GameType);
  }
  newGame() {
    switch (this.m_GameType) {
      case GameType.game_Nest:
      this.m_dataGame.getMineRngCellular(300, 300);
      break;
      case GameType.game_Sque:
      this.m_dataGame.getMineRngSquare(20, 20);
      break;
      case GameType.game_Triangle:
      this.m_dataGame.getMineRngTriangle(20, 20);
      break;
      case GameType.game_Random:
      break;
    }
  }
  private getCrossBrowserElement(mouseEvent) {
    const result = {
      x: 0,
      y: 0,
      relativeX: 0,
      relativeY: 0,
      currentDomId: ''
    };

    if (!mouseEvent) {
      mouseEvent = window.event;
    }

    if (mouseEvent.pageX || mouseEvent.pageY) {
      result.x = mouseEvent.pageX;
      result.y = mouseEvent.pageY;
    } else if (mouseEvent.clientX || mouseEvent.clientY) {
      result.x = mouseEvent.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
      result.y = mouseEvent.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    result.relativeX = result.x;
    result.relativeY = result.y;

    if (mouseEvent.target) {
      let offEl = mouseEvent.target;
      let offX = 0;
      let offY = 0;
      if (typeof (offEl.offsetParent) !== 'undefined') {
        while (offEl) {
          offX += offEl.offsetLeft;
          offY += offEl.offsetTop;
          offEl = offEl.offsetParent;
        }
      } else {
        offX = offEl.x;
        offY = offEl.y;
      }

      result.relativeX -= offX;
      result.relativeY -= offY;
    }
    result.currentDomId = mouseEvent.target.id;
    return result;
  }
  onUserClick(event) {
    const Temp = this.getCrossBrowserElement(event);
    const Temp2 = this.m_dataGame.onLeftMouseDown(Temp.relativeX, Temp.relativeY);
    console.log(Temp2);
  }
  onRightClick(event) {
    const Temp = this.getCrossBrowserElement(event);
    this.m_dataGame.onRightMouseDown(Temp.relativeX, Temp.relativeY);
    return false;
  }
  ngOnInit() {
    const ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');
    this.m_dataGame = new MineRngAgular(this.gameStateResult, ctx);
    this.m_dataGame.getMineRngCellular(300, 300);
  }
}
