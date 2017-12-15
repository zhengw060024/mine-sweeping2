import { EventEmitter } from '@angular/core';
import { MineSubRng, MineGameRng} from './mine-game-rng';
import { PointRng, MineGameState, generateRandom } from './mine-rng-interface';
import { MineRngCellular } from './mine-nest-rng-game';
import { MineRngSquare } from './mine-square-rng-game';
import { MineRngTriangle } from './mine-triangle-rng-game';
export class MineRngAgular {
    m_gameRng: MineGameRng;
    m_eventGameResult: EventEmitter<MineGameState>;
    m_ctx: CanvasRenderingContext2D;
    constructor(event: EventEmitter<MineGameState>, ctx: CanvasRenderingContext2D) {
        this.m_eventGameResult = event;
        this.m_ctx = ctx;
    }
    newGameNotify() {
        this.m_eventGameResult.emit(MineGameState.GameStateNewGame);
    }
    getMineRngCellular() {
        MineSubRng.setDrawTool(this.m_ctx);
        MineGameRng.m_drawTools = this.m_ctx;
        const xl = this.m_ctx.canvas.width;
        const yl = this.m_ctx.canvas.height;
        MineGameRng.m_gameState = MineGameState.GameStateContinue;
        const RngTemp = new MineRngCellular(300, { x: xl / 2, y: yl / 2 });
        RngTemp.createRng();
        RngTemp.drawRng();
        this.m_gameRng = RngTemp;
        return RngTemp;
    }
    getMineRngSquare() {
        MineSubRng.setDrawTool(this.m_ctx);
        MineGameRng.m_drawTools = this.m_ctx;
        MineGameRng.m_gameState = MineGameState.GameStateContinue;
        const RngTemp = new MineRngSquare(20, 20, { x: 20, y: 20 }, 28);
        RngTemp.createRng();
        RngTemp.drawRng();
        this.m_gameRng = RngTemp;
        return RngTemp;
    }
    getMineRngTriangle() {
        MineSubRng.setDrawTool(this.m_ctx);
        MineGameRng.m_drawTools = this.m_ctx;
        MineGameRng.m_gameState = MineGameState.GameStateContinue;
        const RngTemp = new MineRngTriangle(18, 30, { x: 20, y: 20 }, 40);
        RngTemp.createRng();
        RngTemp.drawRng();
        this.m_gameRng = RngTemp;
        return RngTemp;
    }
    generateRandomRng() {
        const Type = generateRandom(0, 2);
        MineSubRng.setDrawTool(this.m_ctx);
        MineGameRng.m_drawTools = this.m_ctx;
        const xl = this.m_ctx.canvas.width;
        const yl = this.m_ctx.canvas.height;
        MineGameRng.m_gameState = MineGameState.GameStateContinue;
        let RngTemp: MineGameRng = null;
        switch ( Type) {
            case 0:
            RngTemp = new MineRngCellular(300, { x: xl / 2, y: yl / 2 });
            break;
            case 1:
            RngTemp = new MineRngSquare(20, 20, { x: 20, y: 20 }, 28);
            break;
            case 2:
            RngTemp = new MineRngTriangle(18, 30, { x: 20, y: 20 }, 40);
            break;
        }
        // RngTemp.se
        RngTemp.setRandom(true);
        RngTemp.createRng();
        RngTemp.drawRng();
        this.m_gameRng = RngTemp;
        return RngTemp;
    }
    onLeftMouseDown(x: number, y: number) {
        let temp = null;
        if (MineGameRng.m_gameState !== MineGameState.GameStateContinue) {
            return temp;
        }
        if (this.m_gameRng) {
            temp = this.m_gameRng.OnLeftMouseDown({ x: x, y: y });
            const state = this.m_gameRng.checkGameIsover();
            if (state === MineGameState.GameStateEndFailed) {
                MineGameRng.m_gameState = MineGameState.GameStateEndFailed;
                this.m_gameRng.drawRngFailed();
                this.m_eventGameResult.emit(MineGameState.GameStateEndFailed);
            } else if (state === MineGameState.GameStateContinue) {
                this.m_gameRng.drawRng();
            } else if (state === MineGameState.GameStateEndSuccess) {
                MineGameRng.m_gameState = MineGameState.GameStateEndSuccess;
                this.m_gameRng.drawRng();
                this.m_eventGameResult.emit(MineGameState.GameStateEndSuccess);
            }
        }
        return temp;
    }
    onRightMouseDown(x: number, y: number) {
        let temp = null;
        if (MineGameRng.m_gameState !== MineGameState.GameStateContinue) {
            return temp;
        }
        if (this.m_gameRng) {
            temp = this.m_gameRng.OnRightMouseDown({ x: x, y: y });
            const state = this.m_gameRng.checkGameIsover();
            if (state === MineGameState.GameStateEndFailed) {
                this.m_gameRng.drawRngFailed();
            } else if (state === MineGameState.GameStateContinue) {
                this.m_gameRng.drawRng();
            } else if (state === MineGameState.GameStateEndSuccess) {
                MineGameRng.m_gameState = MineGameState.GameStateEndSuccess;
                this.m_gameRng.drawRng();
                this.m_eventGameResult.emit(MineGameState.GameStateEndSuccess);
            }
        }
        return temp;
    }
}












