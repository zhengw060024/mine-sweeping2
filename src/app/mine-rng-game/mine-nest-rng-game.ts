import { VisitFlagState, PointRng , MineGameState, UserCheckFlag,
    generateSequenceN , CheckPointInRng} from './mine-rng-interface';
import { MineSubRng, MineGameRng, MineGameRngAg } from './mine-game-rng';

enum NeighborDirectHexagon {
    up_right = 0,
    right = 1,
    right_down = 2,
    left_down = 3,
    left = 4,
    left_up = 5
}
class MineSubRngHexagon extends MineSubRng {
    private static m_ndepartCenter = 40;
    private static m_nH = MineSubRngHexagon.m_ndepartCenter * Math.sqrt(3) / 2;
    private static m_nW = MineSubRngHexagon.m_ndepartCenter / 2;
    private m_arrayNeighbor: Array<[NeighborDirectHexagon, MineSubRngHexagon]>;
    private m_centerPos: PointRng;
    private m_arrayPoint: Array<PointRng>;

    static getNextDirect(direct: NeighborDirectHexagon): NeighborDirectHexagon {
        if (direct < NeighborDirectHexagon.up_right || direct > NeighborDirectHexagon.left_up) {
            console.log('error !!!!!!!!!!!');
        }
        if (direct + 1 > NeighborDirectHexagon.left_up) {
            return NeighborDirectHexagon.up_right;
        } else {
            return direct + 1;
        }
    }
    static getPreDirect(direct: NeighborDirectHexagon): NeighborDirectHexagon {
        if (direct < NeighborDirectHexagon.up_right || direct > NeighborDirectHexagon.left_up) {
            console.log('error !!!!!!!!!!!');
        }
        if (direct - 1 < 0) {
            return NeighborDirectHexagon.left_up;
        } else {
            return direct - 1;
        }
    }
    static getOppositeDirect(direct: NeighborDirectHexagon) {
        if (direct + 3 > NeighborDirectHexagon.left_up) {
            return direct - 3;
        } else {
            return direct + 3;
        }
    }
    static getDirectionCenter(pointCenter: PointRng, direct: NeighborDirectHexagon) {
        const pointReturn: PointRng = { x: 0, y: 0 };
        switch (direct) {
            case NeighborDirectHexagon.up_right:
                pointReturn.x = pointCenter.x + MineSubRngHexagon.m_nW;
                pointReturn.y = pointCenter.y - MineSubRngHexagon.m_nH;
                break;
            case NeighborDirectHexagon.right:
                pointReturn.x = pointCenter.x + MineSubRngHexagon.m_ndepartCenter;
                pointReturn.y = pointCenter.y;
                break;
            case NeighborDirectHexagon.right_down:
                pointReturn.x = pointCenter.x + MineSubRngHexagon.m_nW;
                pointReturn.y = pointCenter.y + MineSubRngHexagon.m_nH;
                break;
            case NeighborDirectHexagon.left_down:
                pointReturn.x = pointCenter.x - MineSubRngHexagon.m_nW;
                pointReturn.y = pointCenter.y + MineSubRngHexagon.m_nH;
                break;
            case NeighborDirectHexagon.left:
                pointReturn.x = pointCenter.x - MineSubRngHexagon.m_ndepartCenter;
                pointReturn.y = pointCenter.y;
                break;
            case NeighborDirectHexagon.left_up:
                pointReturn.x = pointCenter.x - MineSubRngHexagon.m_nW;
                pointReturn.y = pointCenter.y - MineSubRngHexagon.m_nH;
                break;
            default:
                break;
        }
        return pointReturn;
    }


    constructor(id: number) {
        super();
        this.m_id = id;
        this.m_arrayNeighbor = [];
        this.m_centerPos = { x: 0, y: 0 };
        this.m_arrayPoint = [];

    }
    checkClickInRng(pointTocheck: PointRng) {
        return CheckPointInRng(this.m_arrayPoint, pointTocheck);
    }
    getRngCheckPoint() {
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        this.m_arrayPoint.push({
            x: centerx,
            y: centery - h + 4
        });
        this.m_arrayPoint.push({
            x: centerx + wx - 4,
            y: centery - w + 2
        });
        this.m_arrayPoint.push({
            x: centerx + wx - 4,
            y: centery + w - 2
        });
        this.m_arrayPoint.push({
            x: centerx,
            y: centery + h - 4
        });
        this.m_arrayPoint.push({
            x: centerx - wx + 4,
            y: centery + w - 2
        });
        this.m_arrayPoint.push({
            x: centerx - wx + 4,
            y: centery - w + 2
        });
    }
    addNewDirection(newRng: MineSubRngHexagon, direction: NeighborDirectHexagon) {
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

    initMineNum() {
        this.m_arrayNeighbor.forEach((value, index) => {
            const temp1 = value[1];

            if (temp1.m_bIsMine === true) {
                ++this.m_nMineNumNeighbor;
            }

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
    getCurrentNeighborLen() {
        return this.m_arrayNeighbor.length;
    }
    getFirstCreateNeborDirection(): NeighborDirectHexagon {
        if (this.m_arrayNeighbor.length === 0) {
            console.log('xxxxxxxxxxxxxxx-----xxxxxxxx');
            return 0;
        }
        if (this.m_arrayNeighbor.length === 1) {
            return MineSubRngHexagon.getNextDirect(this.m_arrayNeighbor[0][0]);
        }
        let i = 1;
        for (i = 1; i < this.m_arrayNeighbor.length; ++i) {
            const value = this.m_arrayNeighbor[i];
            const value2 = this.m_arrayNeighbor[i - 1];
            if (Math.abs(value[0] - value2[0]) > 1) {
                break;
            }
        }
        if (i < this.m_arrayNeighbor.length) {
            return MineSubRngHexagon.getNextDirect(this.m_arrayNeighbor[i - 1][0]);
        } else {
            return MineSubRngHexagon.getNextDirect(this.m_arrayNeighbor[i - 1][0]);
        }
    }

    getDirectionItem(direct: NeighborDirectHexagon): MineSubRngHexagon | null {
        for (let i = 0; i < this.m_arrayNeighbor.length; ++i) {
            if (this.m_arrayNeighbor[i][0] === direct) {
                return this.m_arrayNeighbor[i][1];
            }
        }
        return null;
    }
    drawRng() {
        if (this.m_bIsOpend === false) {
            this.drawRngClose();
        } else {
            this.drawRngOpen();
        }
    }
    // 当前节点是地雷且未被打开和标注
    drawNormalMineUnCheck() {
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery + h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fillStyle = 'green';
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.arc(centerx, centery, w / 2, 0, 2 * Math.PI);
        MineSubRngHexagon.m_drawTool.fillStyle = 'black';
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();
    }
    // 当前节点是地雷未被打开但是被标注
    drawNomalMineCheck() {
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery + h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fillStyle = 'green';
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.arc(centerx, centery, w / 2, 0, 2 * Math.PI);
        MineSubRngHexagon.m_drawTool.fillStyle = 'black';
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();
    }
    // 当前节点是地雷被打开
    drawErrorMine() {
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery + h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fillStyle = 'green';
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.arc(centerx, centery, w / 2, 0, 2 * Math.PI);
        MineSubRngHexagon.m_drawTool.fillStyle = 'black';
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.strokeStyle = '#FF0000';
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.strokeStyle = '#000000';
    }
    // 当前节点不是地雷，且未标注成地雷
    drawNormalNone() {
        this.drawRngOpen();
    }
    // 当前节点不是地雷，且被标注成地雷
    drawNormalError() {
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery + h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fillStyle = 'blue';
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();
        if (this.m_nMineNumNeighbor !== 0) {
            MineSubRngHexagon.m_drawTool.fillStyle = 'red';
            MineSubRngHexagon.m_drawTool.font = '20px Georgia';
            const nLength = this.m_nMineNumNeighbor.toString().length;
            MineSubRngHexagon.m_drawTool.fillText(this.m_nMineNumNeighbor.toString(), centerx - 5 * nLength - 1, centery + 6);
        }
        MineSubRngHexagon.m_drawTool.strokeStyle = '#FF0000';
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.strokeStyle = '#000000';
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
    drawUnCheck() {
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery + h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fillStyle = 'green';
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();
    }
    drawCheckMine() {
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery + h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fillStyle = 'green';
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.arc(centerx, centery, w / 2, 0, 2 * Math.PI);
        MineSubRngHexagon.m_drawTool.fillStyle = 'red';
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();
    }
    drawCheckMayMine() {
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery + h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fillStyle = 'green';
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.arc(centerx, centery, w / 2, 0, 2 * Math.PI);
        MineSubRngHexagon.m_drawTool.fillStyle = 'blue';
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();
    }
    drawRngOpen() {
        //
        const h = Math.round(MineSubRngHexagon.m_ndepartCenter / Math.sqrt(3));
        const w = Math.round(h / 2);
        const wx = Math.round(MineSubRngHexagon.m_nW);
        const centerx = this.m_centerPos.x;
        const centery = this.m_centerPos.y;
        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx + wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery + h);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery + w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx - wx, centery - w);
        MineSubRngHexagon.m_drawTool.lineTo(centerx, centery - h);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.closePath();

        MineSubRngHexagon.m_drawTool.beginPath();
        MineSubRngHexagon.m_drawTool.moveTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[1].x, this.m_arrayPoint[1].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[2].x, this.m_arrayPoint[2].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[3].x, this.m_arrayPoint[3].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[4].x, this.m_arrayPoint[4].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[5].x, this.m_arrayPoint[5].y);
        MineSubRngHexagon.m_drawTool.lineTo(this.m_arrayPoint[0].x, this.m_arrayPoint[0].y);
        MineSubRngHexagon.m_drawTool.stroke();
        MineSubRngHexagon.m_drawTool.fillStyle = 'blue';
        MineSubRngHexagon.m_drawTool.fill();
        MineSubRngHexagon.m_drawTool.closePath();
        if (this.m_nMineNumNeighbor !== 0) {
            MineSubRngHexagon.m_drawTool.fillStyle = 'red';
            MineSubRngHexagon.m_drawTool.font = '20px Georgia';
            const nLength = this.m_nMineNumNeighbor.toString().length;
            MineSubRngHexagon.m_drawTool.fillText(this.m_nMineNumNeighbor.toString(), centerx - 5 * nLength - 1, centery + 6);
        }
    }
    printSelf() {
        let strid: string = this.m_id.toString();
        this.m_arrayNeighbor.forEach((value, index) => {

            strid += '  , ' + value[1].m_id.toString();

        });
        console.log(strid);
    }
    setCenterPoint(pointCenter: PointRng) {
        this.m_centerPos.x = pointCenter.x;
        this.m_centerPos.y = pointCenter.y;
    }
    initNeighborPos() {
        this.m_arrayNeighbor.forEach((value, index) => {
            const PointTemp = MineSubRngHexagon.getDirectionCenter(this.m_centerPos, value[0]);
            value[1].setCenterPoint(PointTemp);
        });
    }

}

export class MineRngCellular extends MineGameRngAg<MineSubRngHexagon> {
    private m_maxNestNum: number;
    private m_startPoint: PointRng;
    constructor(nMaxNum: number, pointStart: PointRng) {
        super();
        this.m_maxNestNum = nMaxNum;
        this.m_arrayRng = [];
        this.m_startPoint = pointStart;
    }
    printRng() {
        this.m_arrayRng.forEach((value, index) => {
            value.printSelf();
        });
    }

    makeNeighbor(oldNest: MineSubRngHexagon, newNest: MineSubRngHexagon, direct: NeighborDirectHexagon) {
        oldNest.addNewDirection(newNest, direct);
        const oppositeDirection = MineSubRngHexagon.getOppositeDirect(direct);
        newNest.addNewDirection(oldNest, oppositeDirection);
        const directPre = MineSubRngHexagon.getPreDirect(direct);
        const directNext = MineSubRngHexagon.getNextDirect(direct);
        const preItem = oldNest.getDirectionItem(directPre);

        const nextItem = oldNest.getDirectionItem(directNext);
        if (preItem) {
            preItem.addNewDirection(newNest, directNext);
            newNest.addNewDirection(preItem, MineSubRngHexagon.getOppositeDirect(directNext));
        }
        if (nextItem) {
            nextItem.addNewDirection(newNest, directPre);
            newNest.addNewDirection(nextItem, MineSubRngHexagon.getOppositeDirect(directPre));
        }

    }
    createRng() {
        let currentCreateIndex = 0;
        let currentCenterID = 0;
        let currentRng = new MineSubRngHexagon(currentCreateIndex);
        currentRng.setCenterPoint(this.m_startPoint);
        this.m_arrayRng.push(currentRng);
        while (currentCreateIndex < this.m_maxNestNum - 1) {
            let direct: NeighborDirectHexagon = currentRng.getFirstCreateNeborDirection();
            while (currentRng.getCurrentNeighborLen() < 6) {
                ++currentCreateIndex;
                const newNest = new MineSubRngHexagon(currentCreateIndex);
                this.m_arrayRng.push(newNest);
                this.makeNeighbor(currentRng, newNest, direct);
                direct = MineSubRngHexagon.getNextDirect(direct);
                if (currentCreateIndex === this.m_maxNestNum - 1) {
                    break;
                }
            }
            ++currentCenterID;
            currentRng = this.m_arrayRng[currentCenterID];
        }
        this.initAllRngPos();
        // 生成地雷
        this.generateMine(15);
        // 生成地雷数目
    }
    private initAllRngPos() {
        this.m_arrayRng.forEach((value, index) => {
            value.initNeighborPos();
        });
        this.m_arrayRng.forEach((value, index) => {
            value.getRngCheckPoint();
        });
    }
}
