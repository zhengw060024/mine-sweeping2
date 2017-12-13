import { VisitFlagState, PointRng , MineGameState, UserCheckFlag, generateSequenceN} from './mine-rng-interface';
export abstract class MineGameRng {
    static m_drawTools: CanvasRenderingContext2D;
    static m_gameState: MineGameState;
    protected clearDrawRect() {
        MineGameRng.m_drawTools.clearRect(0, 0, MineGameRng.m_drawTools.canvas.width, MineGameRng.m_drawTools.canvas.height);
    }
    abstract createRng();
    abstract drawRng();
    abstract drawRngFailed();
    protected abstract onCheckPointInRng(point: PointRng): MineSubRng | null;
    abstract checkGameIsover(): MineGameState;
    onOpenSubRng(clickedRng: MineSubRng) {
        // 广度优先遍历
        clickedRng.onClickRng();
    }
    OnLeftMouseDown(point: PointRng) {
        const Temp = this.onCheckPointInRng(point);
        if (Temp) {
            Temp.onClickRng();
        }
        return Temp;
    }
    OnRightMouseDown(point: PointRng) {
        const Temp = this.onCheckPointInRng(point);
        if (Temp) {
            Temp.onRCheckRng();
        }
        return Temp;
    }
}
export abstract class MineGameRngAg<T extends MineSubRng> extends MineGameRng {
    protected m_arrayRng: Array<T>;

    protected generateMine(maxMine: number) {
        const ArrayMine = generateSequenceN(this.m_arrayRng.length - 1, maxMine);
        console.log(`mine area is ${ArrayMine}`);
        ArrayMine.forEach((value, index) => {
            this.m_arrayRng[value].setMine();
        });
        this.m_arrayRng.forEach((value, index) => {
            value.initMineNum();
        });
    }
      // 判断鼠标落点
      onCheckPointInRng(point: PointRng): MineSubRng | null {
        for (let i = 0; i < this.m_arrayRng.length; ++i) {
            if (this.m_arrayRng[i].checkClickInRng(point)) {
                return this.m_arrayRng[i];
            }
        }
        return null;
    }
    checkGameIsover() {
        //
        let bSuccess = true;
        for (let i = 0; i < this.m_arrayRng.length; ++i) {
            const value = this.m_arrayRng[i];
            // 先判断有没有失败
            if (value.isMine()) {
                if (value.isOpened()) {
                    return MineGameState.GameStateEndFailed;
                }
                if (!value.isCheckedMine()) {
                    bSuccess = false;
                }
            } else {
                if (!value.isOpened()) {
                    bSuccess = false;
                }
            }
        }
        if (bSuccess) {
            return MineGameState.GameStateEndSuccess;
        } else {
            return MineGameState.GameStateContinue;
        }
    }
    drawRngFailed() {
        this.clearDrawRect();
        this.m_arrayRng.forEach((value, key) => {
            value.drawRngFailed();
        });
    }
    drawRng() {
        this.clearDrawRect();
        this.m_arrayRng.forEach((value, key) => {
            value.drawRng();
        });
    }
}
export abstract class MineSubRng {
    protected static m_drawTool: CanvasRenderingContext2D;

    constructor() {
        this.m_visitTempFlag = VisitFlagState.none;
        this.m_bIsMine = false;
        this.m_bIsOpend = false;
        this.m_id = 0;
        this.m_nMineNumNeighbor = 0;
        this.m_userCheckState = UserCheckFlag.UserCheckFlag_none;
    }
    protected m_visitTempFlag: VisitFlagState;
    protected m_bIsMine: boolean;
    protected m_bIsOpend: boolean;
    protected m_id: number;
    protected m_nMineNumNeighbor: number;
    protected m_userCheckState: UserCheckFlag;
    static setDrawTool(ctx: CanvasRenderingContext2D) {
        MineSubRng.m_drawTool = ctx;
    }
    abstract initMineNum(): void;
    abstract drawRng(): void;
    abstract drawRngFailed(): void;
    abstract getNeighborMineNum(): number;
    abstract checkClickInRng(pointTocheck: PointRng): boolean;
    protected getVisitState(): VisitFlagState {
        return this.m_visitTempFlag;
    }
    protected setVistState(visitState: VisitFlagState) {
        this.m_visitTempFlag = visitState;

    }
    // abstract checkClickInRng():boolean;
    isMine(): boolean {
        return this.m_bIsMine;
    }
    isOpened(): boolean {
        return this.m_bIsOpend;
    }
    isCheckedMine(): boolean {
        return this.m_userCheckState === UserCheckFlag.UserCheckFlag_mine;
    }
    setMine() {
        this.m_bIsMine = true;
    }
    onRCheckRng() {
        if (this.m_bIsOpend) {
            return;
        }
        if (this.m_userCheckState !== UserCheckFlag.UserCheckFlag_maybemie) {
            ++this.m_userCheckState;
        } else {
            this.m_userCheckState = UserCheckFlag.UserCheckFlag_none;
        }
    }
    onClickRng() {
        if (this.m_bIsOpend) {
            return;
        }
        if (this.m_bIsMine) {
            this.m_bIsOpend = true;
            return;
        }
        if (this.getNeighborMineNum() !== 0) {
            this.m_bIsOpend = true;
            return;
        }
        const arrayTemp: Array<MineSubRng> = [];
        this.setVistState(VisitFlagState.tryVisit);
        arrayTemp.push(this);

        while (arrayTemp.length > 0) {
            const tempValue = <MineSubRng>arrayTemp.shift();
            tempValue.setVistState(VisitFlagState.visited);
            tempValue.m_bIsOpend = true;
            tempValue.forEveryDirection((value) => {
                if (value.m_bIsOpend === false) {
                    if (value.getNeighborMineNum() === 0 && value.m_bIsMine === false) {
                        if (value.getVisitState() === VisitFlagState.none) {
                            value.setVistState(VisitFlagState.tryVisit);
                            arrayTemp.push(value);
                        }
                    } else {
                        if (!value.m_bIsMine) {
                            value.m_bIsOpend = true;
                        }
                    }
                }
            });
        }
    }
    protected abstract forEveryDirection(callback: (value:
        MineSubRng) => void): void;
}
