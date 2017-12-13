import { VisitFlagState, PointRng , MineGameState, UserCheckFlag,
    generateSequenceN , CheckPointInRng} from './mine-rng-interface';
import { MineSubRng, MineGameRng} from './mine-game-rng';
export enum NeighborDirectSqu {
    up,
    up_right,
    right,
    right_down,
    down,
    down_left,
    left,
    leftup
}
class MineSubRngSquare extends MineSubRng {
    private m_arrayNeighbor: Array<[NeighborDirectSqu, MineSubRngSquare]>;
    private m_arrayPoint: Array<PointRng>;
    constructor(id: number) {
        super();
        this.m_id = id;
    }
    checkClickInRng(pointTocheck: PointRng) {
        return true;
    }
    addNewDirection(newRng: MineSubRngSquare, direction: NeighborDirectSqu) {
        let i = 0;
        for (i = 0; i < this.m_arrayNeighbor.length; ++i) {
            const directionLocal = this.m_arrayNeighbor[i][0];
            if (directionLocal === direction) {
                return;
            } else if (directionLocal > direction) {
                break;
            }
        }
        // 插入新的位置
        this.m_arrayNeighbor.splice(i, 0, [direction, newRng]);
    }
    initRngArea(pointStart: PointRng, sideLength: number) {
        this.m_arrayPoint.push(pointStart);
        this.m_arrayPoint.push({
            x: pointStart.x + sideLength,
            y: pointStart.y
        });
        this.m_arrayPoint.push({
            x: pointStart.x + sideLength,
            y: pointStart.y + sideLength
        });
        this.m_arrayPoint.push({
            x: pointStart.x,
            y: pointStart.y + sideLength
        });
    }
    getNeighborMineNum(): number {
        return this.m_nMineNumNeighbor;
    }

    protected forEveryDirection(callback: (value: MineSubRng) => void) {
        return this.m_arrayNeighbor.forEach((value, index) => {
            callback(value[1]);
        });
    }

    drawRng() {
    }
}

class MineRngSquare extends MineGameRng {
    private m_arrayRng: Array<MineSubRngSquare>;
    private m_row: number;
    private m_col: number;
    private m_pointStart: PointRng;
    private m_sideLength: number;
    constructor(row: number, col: number, startPoit: PointRng, sideLength: number) {
        super();
        this.m_col = col;
        this.m_row = row;
        this.m_pointStart = startPoit;
    }
    createRng() {
        let kIndex = 0;
        for (let i = 0; i < this.m_row; ++i) {
            for (let j = 0; j < this.m_col; ++j) {
                this.createNewSubRng(i, j, kIndex);
                ++kIndex;
            }
        }
    }
    drawRng() {
    }
    drawRngFailed() {

    }
    onOpenSubRng(clickedRng: MineSubRng) {
        // 广度优先遍历
        clickedRng.onClickRng();
    }
    checkGameIsover() {
        return MineGameState.GameStateContinue;
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
    private generateMine(maxMine: number) {
        const ArrayMine = generateSequenceN(this.m_arrayRng.length - 1, maxMine);
        console.log(`mine area is ${ArrayMine}`);
        ArrayMine.forEach((value, index) => {
            this.m_arrayRng[value].setMine();
        });
    }
    private createNewSubRng(i: number, j: number, currentIndex: number) {
        const newRng = new MineSubRngSquare(currentIndex);
        // 初始化他的邻居，从up方向开始，顺时针方向,对所有存在邻居建立索引
        if (i > 0) {
            const upRngKey = currentIndex - this.m_col;
            const upRng = this.m_arrayRng[upRngKey];
            newRng.addNewDirection(upRng, NeighborDirectSqu.up);
            upRng.addNewDirection(newRng, NeighborDirectSqu.down);
            if (j < this.m_col - 1) {
                const upRightRng = this.m_arrayRng[upRngKey + 1];
                newRng.addNewDirection(upRightRng, NeighborDirectSqu.up_right);
                upRightRng.addNewDirection(newRng, NeighborDirectSqu.down_left);
            }
            if (j > 0) {
                const leftupRng = this.m_arrayRng[upRngKey - 1];
                newRng.addNewDirection(leftupRng, NeighborDirectSqu.leftup);
                leftupRng.addNewDirection(newRng, NeighborDirectSqu.right_down);
            }
        }
        if (j > 0) {
            const LeftRng = this.m_arrayRng[currentIndex - 1];
            newRng.addNewDirection(LeftRng, NeighborDirectSqu.left);
            LeftRng.addNewDirection(newRng, NeighborDirectSqu.right);
        }
        newRng.initRngArea({
            x: this.m_pointStart.x + j * this.m_sideLength,
            y: this.m_pointStart.y + i * this.m_sideLength
        }, this.m_sideLength);
    }
}
