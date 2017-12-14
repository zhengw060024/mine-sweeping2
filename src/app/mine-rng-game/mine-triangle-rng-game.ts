import {
    VisitFlagState, PointRng, MineGameState, UserCheckFlag,
    generateSequenceN, CheckPointInRng
} from './mine-rng-interface';
import { MineSubRng, MineGameRng, MineGameRngAg } from './mine-game-rng';
import { NeighborDirectSqu } from './mine-square-rng-game';
enum NeighborDirectTriangle {
    TriangleDirection_1 = 0,
    TriangleDirection_2,
    TriangleDirection_3,
    TriangleDirection_4,
    TriangleDirection_5,
    TriangleDirection_6,
    TriangleDirection_7,
    TriangleDirection_8,
    TriangleDirection_9,
    TriangleDirection_10,
    TriangleDirection_11,
    TriangleDirection_12
}
class MineSubRngTriangle extends MineSubRng {
    private m_arrayNeighbor: Array<[NeighborDirectTriangle, MineSubRngTriangle]>;
    private m_arrayPoint: Array<PointRng>;
    private m_bDirection: boolean;
    constructor(id: number) {
        super();
        this.m_id = id;
        this.m_arrayNeighbor = [];
        this.m_arrayPoint = [];
        this.m_bDirection = false;
    }
    static getOppositeDirection(direct: NeighborDirectTriangle): NeighborDirectTriangle {
        if (direct > NeighborDirectTriangle.TriangleDirection_6) {
            return direct - 6;
        } else {
            return direct + 6;
        }
    }
    setTriangleDirection(direct: boolean) {
        this.m_bDirection = direct;
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
    addNewDirection(newRng: MineSubRngTriangle, direction: NeighborDirectTriangle) {
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
    initRngArea(pointStart: PointRng, sideLength: number, type: boolean) {
        this.m_arrayPoint.push(pointStart);
        if (type) {
            this.m_arrayPoint.push({
                x: pointStart.x + Math.floor(sideLength / 2),
                y: pointStart.y + Math.floor(Math.sqrt(3) * sideLength / 2)
            });

            this.m_arrayPoint.push({
                x: pointStart.x - Math.floor(sideLength / 2),
                y: pointStart.y + Math.floor(Math.sqrt(3) * sideLength / 2)
            });

        } else {
            this.m_arrayPoint.push({
                x: pointStart.x + sideLength,
                y: pointStart.y
            });

            this.m_arrayPoint.push({
                x: pointStart.x + Math.floor(sideLength / 2),
                y: pointStart.y + Math.floor(Math.sqrt(3) * sideLength / 2)
            });
        }
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
        MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.closePath();
    }
    drawUnCheck() {
        this.drawFrame();

        MineSubRng.m_drawTool.beginPath();
        if (this.m_bDirection) {
            MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y + 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[1].x - 2, this.m_arrayPoint[1].y - 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x + 2, this.m_arrayPoint[2].y - 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y + 2);
        } else {
            MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x + 2, this.m_arrayPoint[0].y + 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[1].x - 2, this.m_arrayPoint[1].y + 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y - 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[0].x + 2, this.m_arrayPoint[0].y + 2);
        }
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fillStyle = 'green';
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawErrorMine() {
        this.drawUnCheck();
        let centerx = 0;
        let centery = 0;
        let r = 0;
        if (this.m_bDirection) {
            r = Math.floor(2 * (this.m_arrayPoint[1].y - this.m_arrayPoint[0].y) / 3);
            centerx = this.m_arrayPoint[0].x;
            centery = r + this.m_arrayPoint[0].y;
        } else {
            r = Math.floor(2 * (this.m_arrayPoint[2].y - this.m_arrayPoint[0].y) / 3);
            centerx = (this.m_arrayPoint[0].x + this.m_arrayPoint[1].x) / 2;
            centery = r / 2 + this.m_arrayPoint[0].y;
        }
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(centerx, centery, r / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'black';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
        MineSubRng.m_drawTool.strokeStyle = '#FF0000';
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRng.m_drawTool.lineTo((this.m_arrayPoint[2].x + this.m_arrayPoint[1].x) / 2,
            (this.m_arrayPoint[2].y + this.m_arrayPoint[1].y) / 2);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRng.m_drawTool.lineTo((this.m_arrayPoint[0].x + this.m_arrayPoint[2].x) / 2,
            (this.m_arrayPoint[0].y + this.m_arrayPoint[2].y) / 2);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.strokeStyle = '#000000';
    }
    drawNomalMineCheck() {
        this.drawUnCheck();
        let centerx = 0;
        let centery = 0;
        let r = 0;
        if (this.m_bDirection) {
            r = Math.floor(2 * (this.m_arrayPoint[1].y - this.m_arrayPoint[0].y) / 3);
            centerx = this.m_arrayPoint[0].x;
            centery = r + this.m_arrayPoint[0].y;
        } else {
            r = Math.floor(2 * (this.m_arrayPoint[2].y - this.m_arrayPoint[0].y) / 3);
            centerx = (this.m_arrayPoint[0].x + this.m_arrayPoint[1].x) / 2;
            centery = r / 2 + this.m_arrayPoint[0].y;
        }
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(centerx, centery, r / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'black';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawNormalMineUnCheck() {
        this.drawUnCheck();
        let centerx = 0;
        let centery = 0;
        let r = 0;
        if (this.m_bDirection) {
            r = Math.floor(2 * (this.m_arrayPoint[1].y - this.m_arrayPoint[0].y) / 3);
            centerx = this.m_arrayPoint[0].x;
            centery = r + this.m_arrayPoint[0].y;
        } else {
            r = Math.floor(2 * (this.m_arrayPoint[2].y - this.m_arrayPoint[0].y) / 3);
            centerx = (this.m_arrayPoint[0].x + this.m_arrayPoint[1].x) / 2;
            centery = r / 2 + this.m_arrayPoint[0].y;
        }
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(centerx, centery, r / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'black';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawNormalError() {
        this.drawRngOpen();
        MineSubRng.m_drawTool.strokeStyle = '#FF0000';
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRng.m_drawTool.lineTo((this.m_arrayPoint[2].x + this.m_arrayPoint[1].x) / 2,
            (this.m_arrayPoint[2].y + this.m_arrayPoint[1].y) / 2);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRng.m_drawTool.lineTo((this.m_arrayPoint[0].x + this.m_arrayPoint[2].x) / 2,
            (this.m_arrayPoint[0].y + this.m_arrayPoint[2].y) / 2);
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.strokeStyle = '#000000';
    }
    drawNormalNone() {
        this.drawRngOpen();
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
    drawCheckMayMine() {
        this.drawUnCheck();
        let centerx = 0;
        let centery = 0;
        let r = 0;
        if (this.m_bDirection) {
            r = Math.floor(2 * (this.m_arrayPoint[1].y - this.m_arrayPoint[0].y) / 3);
            centerx = this.m_arrayPoint[0].x;
            centery = r + this.m_arrayPoint[0].y;
        } else {
            r = Math.floor(2 * (this.m_arrayPoint[2].y - this.m_arrayPoint[0].y) / 3);
            centerx = (this.m_arrayPoint[0].x + this.m_arrayPoint[1].x) / 2;
            centery = r / 2 + this.m_arrayPoint[0].y;
        }
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(centerx, centery, r / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'blue';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
    }
    drawCheckMine() {
        this.drawUnCheck();
        let centerx = 0;
        let centery = 0;
        let r = 0;
        if (this.m_bDirection) {
            r = Math.floor(2 * (this.m_arrayPoint[1].y - this.m_arrayPoint[0].y) / 3);
            centerx = this.m_arrayPoint[0].x;
            centery = r + this.m_arrayPoint[0].y;
        } else {
            r = Math.floor(2 * (this.m_arrayPoint[2].y - this.m_arrayPoint[0].y) / 3);
            centerx = (this.m_arrayPoint[0].x + this.m_arrayPoint[1].x) / 2;
            centery = r / 2 + this.m_arrayPoint[0].y;
        }
        MineSubRng.m_drawTool.beginPath();
        MineSubRng.m_drawTool.arc(centerx, centery, r / 4, 0, 2 * Math.PI);
        MineSubRng.m_drawTool.fillStyle = 'red';
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();
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
    drawRngOpen() {
        this.drawFrame();

        MineSubRng.m_drawTool.beginPath();
        if (this.m_bDirection) {
            MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y + 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[1].x - 2, this.m_arrayPoint[1].y - 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x + 2, this.m_arrayPoint[2].y - 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y + 2);
        } else {
            MineSubRng.m_drawTool.moveTo(this.m_arrayPoint[0].x + 2, this.m_arrayPoint[0].y + 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[1].x - 2, this.m_arrayPoint[1].y + 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y - 2);
            MineSubRng.m_drawTool.lineTo(this.m_arrayPoint[0].x + 2, this.m_arrayPoint[0].y + 2);
        }
        MineSubRng.m_drawTool.stroke();
        MineSubRng.m_drawTool.fillStyle = 'blue';
        MineSubRng.m_drawTool.fill();
        MineSubRng.m_drawTool.closePath();

        let centerx = 0;
        let centery = 0;
        let r = 0;
        if (this.m_bDirection) {
            r = Math.floor(2 * (this.m_arrayPoint[1].y - this.m_arrayPoint[0].y) / 3);
            centerx = this.m_arrayPoint[0].x;
            centery = r + this.m_arrayPoint[0].y;
        } else {
            r = Math.floor(2 * (this.m_arrayPoint[2].y - this.m_arrayPoint[0].y) / 3);
            centerx = (this.m_arrayPoint[0].x + this.m_arrayPoint[1].x) / 2;
            centery = r / 2 + this.m_arrayPoint[0].y;
        }
        if (this.m_nMineNumNeighbor !== 0) {
            MineSubRng.m_drawTool.fillStyle = 'red';
            MineSubRng.m_drawTool.font = '20px Georgia';
            const nLength = this.m_nMineNumNeighbor.toString().length;
            MineSubRng.m_drawTool.fillText(this.m_nMineNumNeighbor.toString(), centerx - 5 * nLength - 1, centery + 6);
        }

    }
    drawRng() {
        if (this.m_bIsOpend === false) {
            this.drawRngClose();
        } else {
            this.drawRngOpen();
        }
    }

}
export class MineRngTriangle extends MineGameRngAg<MineSubRngTriangle> {
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
    //
    private initSelfDirection(i: number, j: number, currentIndex: number, direction: boolean) {
        // 正三角
        const currentItem = this.m_arrayRng[currentIndex];
        if (!direction) {
            if (i > 0) {
                // 需要处理五种情况
                const upIndex = currentIndex - this.m_col;
                const temp2 = this.m_arrayRng[upIndex];
                currentItem.addNewDirection(temp2, NeighborDirectTriangle.TriangleDirection_1);
                temp2.addNewDirection(currentItem, MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_1));

                if (j >= 2) {
                    const temp0 = this.m_arrayRng[upIndex - 2];
                    currentItem.addNewDirection(temp0, NeighborDirectTriangle.TriangleDirection_11);
                    temp0.addNewDirection(currentItem,
                        MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_11));
                }
                if (j >= 1) {
                    const temp1 = this.m_arrayRng[upIndex - 1];
                    currentItem.addNewDirection(temp1, NeighborDirectTriangle.TriangleDirection_12);
                    temp1.addNewDirection(currentItem,
                        MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_12));
                }

                if (j < this.m_col - 2) {
                    const temp4 = this.m_arrayRng[upIndex + 2];
                    currentItem.addNewDirection(temp4, NeighborDirectTriangle.TriangleDirection_3);
                    temp4.addNewDirection(currentItem,
                        MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_3));
                }
                if (j < this.m_col - 1) {
                    const temp3 = this.m_arrayRng[upIndex + 1];
                    currentItem.addNewDirection(temp3, NeighborDirectTriangle.TriangleDirection_2);
                    temp3.addNewDirection(currentItem,
                        MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_2));
                }
            }
            if (j >= 2) {
                const tempI2 = this.m_arrayRng[currentIndex - 2];
                currentItem.addNewDirection(tempI2, NeighborDirectTriangle.TriangleDirection_10);
                tempI2.addNewDirection(currentItem, MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_10));
            }
            if (j >= 1) {
                const tempI1 = this.m_arrayRng[currentIndex - 1];
                currentItem.addNewDirection(tempI1, NeighborDirectTriangle.TriangleDirection_9);
                tempI1.addNewDirection(currentItem, MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_9));
            }
        } else {
            if (i > 0) {
                // 需要处理三种情况
                // [i- 1, j] [i -1 ,j + 1] [i - 1,j -1]
                const upIndex = currentIndex - this.m_col;
                const temp1 = this.m_arrayRng[upIndex];
                currentItem.addNewDirection(temp1, NeighborDirectTriangle.TriangleDirection_1);
                temp1.addNewDirection(currentItem, MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_1));
                if (j > 0) {
                    const temp0 = this.m_arrayRng[upIndex - 1];
                    currentItem.addNewDirection(temp0, NeighborDirectTriangle.TriangleDirection_12);
                    temp0.addNewDirection(currentItem,
                         MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_12));
                }
                if (j < this.m_col - 1) {
                    const temp2 = this.m_arrayRng[upIndex + 1];
                    currentItem.addNewDirection(temp2, NeighborDirectTriangle.TriangleDirection_2);
                    temp2.addNewDirection(currentItem,
                        MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_2));
                }
            }

            if (j >= 2) {
                const tempI2 = this.m_arrayRng[currentIndex - 2];
                currentItem.addNewDirection(tempI2, NeighborDirectTriangle.TriangleDirection_10);
                tempI2.addNewDirection(currentItem, MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_10));
            }
            if (j >= 1) {
                const tempI1 = this.m_arrayRng[currentIndex - 1];
                currentItem.addNewDirection(tempI1, NeighborDirectTriangle.TriangleDirection_11);
                tempI1.addNewDirection(currentItem, MineSubRngTriangle.getOppositeDirection(NeighborDirectTriangle.TriangleDirection_11));
            }
        }
    }
    private createNewSubRng(i: number, j: number, currentIndex: number) {
        let bType = false;
        const newRng = new MineSubRngTriangle(currentIndex);
        this.m_arrayRng.push(newRng);
        // 初始化他的邻居，从up方向开始，顺时针方向,对所有存在邻居建立索引
        if (i % 2 === 0) {
            if (j % 2 === 0) {
                // 倒三角形
                this.initSelfDirection(i, j, currentIndex, false);
                bType = false;
            } else {
                // 正三角形
                this.initSelfDirection(i, j, currentIndex, true);
                bType = true;
            }
        } else {
            if (j % 2 === 0) {
                // 正三角形
                this.initSelfDirection(i, j, currentIndex, true);
                bType = true;
            } else {
                // 倒三角形
                this.initSelfDirection(i, j, currentIndex, false);
                bType = false;
            }
        }
        newRng.setTriangleDirection(bType);
        if (i % 2 === 0) {
            const x = this.m_pointStart.x + Math.floor((j + 1) / 2) * this.m_sideLength;
            const y = this.m_pointStart.y + Math.round(i * this.m_sideLength * Math.sqrt(3) / 2);
            newRng.initRngArea({
                x: x,
                y: y
            }, this.m_sideLength, bType);
        } else {
            const x = this.m_pointStart.x + Math.floor(j / 2) * this.m_sideLength + Math.floor(this.m_sideLength / 2);
            const y = this.m_pointStart.y + Math.round(i * this.m_sideLength * Math.sqrt(3) / 2);
            newRng.initRngArea({
                x: x,
                y: y
            }, this.m_sideLength, bType);
        }
    }
}
