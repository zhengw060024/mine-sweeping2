import {
    VisitFlagState, PointRng, MineGameState, UserCheckFlag,
    generateSequenceN, CheckPointInRng
} from './mine-rng-interface';
import { MineSubRng, MineGameRng, MineGameRngAg } from './mine-game-rng';
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
        this.m_arrayNeighbor = [];
        this.m_arrayPoint = [];
    }
    initMineNum() {
        this.m_arrayNeighbor.forEach((value, index) => {
            const temp1 = value[1];
            if (temp1.m_bIsMine === true) {
                ++this.m_nMineNumNeighbor;
            }
        });
    }
    checkClickInRng(pointTocheck: PointRng) {
        return CheckPointInRng(this.m_arrayPoint, pointTocheck);
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

    drawFrame() {
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.closePath();
    }
    drawUnCheck() {
        this.drawFrame();

        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x + 2, this.m_arrayPoint[0].y + 2);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[1].x - 2, this.m_arrayPoint[1].y + 2);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x - 2, this.m_arrayPoint[2].y - 2);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[3].x + 2, this.m_arrayPoint[3].y - 2);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[0].x + 2, this.m_arrayPoint[0].y + 2);

        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fillStyle = 'green';
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawCheckMayMine() {
        this.drawUnCheck();
        const x = this.m_arrayPoint[1].x - this.m_arrayPoint[0].x;
        const y = this.m_arrayPoint[3].y - this.m_arrayPoint[0].y;
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(this.m_arrayPoint[0].x + x / 2, this.m_arrayPoint[0].y + y / 2, x / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'blue';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawCheckMine() {
        this.drawUnCheck();
        const x = this.m_arrayPoint[1].x - this.m_arrayPoint[0].x;
        const y = this.m_arrayPoint[3].y - this.m_arrayPoint[0].y;
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(this.m_arrayPoint[0].x + x / 2, this.m_arrayPoint[0].y + y / 2, x / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'red';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawRngOpen() {
        this.drawFrame();

        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x + 2, this.m_arrayPoint[0].y + 2);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[1].x - 2, this.m_arrayPoint[1].y + 2);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x - 2, this.m_arrayPoint[2].y - 2);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[3].x + 2, this.m_arrayPoint[3].y - 2);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[0].x + 2, this.m_arrayPoint[0].y + 2);

        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fillStyle = 'blue';
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
        const x = this.m_arrayPoint[1].x - this.m_arrayPoint[0].x;
        const y = this.m_arrayPoint[3].y - this.m_arrayPoint[0].y;
        const centerx = this.m_arrayPoint[0].x + x / 2;
        const centery = this.m_arrayPoint[0].y + y / 2;
        if (this.m_nMineNumNeighbor !== 0) {
            MineSubRng.m_drawTool.fillStyle = 'red';
            MineSubRng.m_drawTool.font = '20px Georgia';
            const nLength = this.m_nMineNumNeighbor.toString().length;
            MineSubRng.m_drawTool.fillText(this.m_nMineNumNeighbor.toString(), centerx - 5 * nLength - 1, centery + 6);
        }

    }
    drawErrorMine() {
        this.drawUnCheck();
        const x = this.m_arrayPoint[1].x - this.m_arrayPoint[0].x;
        const y = this.m_arrayPoint[3].y - this.m_arrayPoint[0].y;
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(this.m_arrayPoint[0].x + x / 2, this.m_arrayPoint[0].y + y / 2, x / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'black';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
        MineSubRng.m_drawTool.strokeStyle = '#FF0000';
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.strokeStyle = '#000000';
    }
    drawNomalMineCheck() {
        this.drawUnCheck();
        const x = this.m_arrayPoint[1].x - this.m_arrayPoint[0].x;
        const y = this.m_arrayPoint[3].y - this.m_arrayPoint[0].y;
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(this.m_arrayPoint[0].x + x / 2, this.m_arrayPoint[0].y + y / 2, x / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'black';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawNormalMineUnCheck() {
        this.drawUnCheck();
        const x = this.m_arrayPoint[1].x - this.m_arrayPoint[0].x;
        const y = this.m_arrayPoint[3].y - this.m_arrayPoint[0].y;
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(this.m_arrayPoint[0].x + x / 2, this.m_arrayPoint[0].y + y / 2, x / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'black';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawNormalError() {
        this.drawRngOpen();
        MineSubRng.m_drawTool.strokeStyle = '#FF0000';
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.strokeStyle = '#000000';
    }
    drawRngClose() {
        switch (this.m_userCheckState) {
            case UserCheckFlag.UserCheckFlag_none:
                this.drawUnCheck();
                break;
            case UserCheckFlag.UserCheckFlag_maybemie:
                this.drawCheckMayMine();
                break;
            case UserCheckFlag.UserCheckFlag_mine:
                this.drawCheckMine();
                break;
            default:
                break;
        }
    }
    drawNormalNone() {
        this.drawRngOpen();
    }
    drawRng() {
        if (this.m_bIsOpend === false) {
            this.drawRngClose();
        } else {
            this.drawRngOpen();
        }
    }
    drawRngFailed() {
        if (this.m_bIsMine) {
            // this.drawRngClose();
            if (this.m_bIsOpend) {
                this.drawErrorMine();
            } else {
                if (this.m_userCheckState === UserCheckFlag.UserCheckFlag_mine) {
                    this.drawNomalMineCheck();
                } else {
                    this.drawNormalMineUnCheck();
                }
            }
        } else {
            if (this.m_userCheckState === UserCheckFlag.UserCheckFlag_mine) {
                this.drawNormalError();
            } else {
                this.drawNormalNone();
            }
        }
    }
}

export class MineRngSquare extends MineGameRngAg<MineSubRngSquare> {
    private m_row: number;
    private m_col: number;
    private m_pointStart: PointRng;
    private m_sideLength: number;
    constructor(row: number, col: number, startPoit: PointRng, sideLength: number) {
        super();
        this.m_col = col;
        this.m_row = row;
        this.m_pointStart = startPoit;
        this.m_arrayRng = [];
        this.m_sideLength = sideLength;
    }
    createRng() {
        let kIndex = 0;
        for (let i = 0; i < this.m_row; ++i) {
            for (let j = 0; j < this.m_col; ++j) {
                this.createNewSubRng(i, j, kIndex);
                ++kIndex;
            }
        }
        this.generateMine(50);
    }
    private createNewSubRng(i: number, j: number, currentIndex: number) {
        const newRng = new MineSubRngSquare(currentIndex);
        this.m_arrayRng.push(newRng);
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
