import { VisitFlagState, PointRng , MineGameState, UserCheckFlag} from './mine-rng-interface';
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
    abstract drawRng(): void;
    abstract getNeighborMineNum(): number;

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
