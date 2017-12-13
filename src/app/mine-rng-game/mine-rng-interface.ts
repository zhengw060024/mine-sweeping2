export enum MineGameState {
    GameStateEndFailed = 0,
    GameStateEndSuccess = 1,
    GameStateContinue = 2
}
export enum UserCheckFlag {
    UserCheckFlag_none = 0,
    UserCheckFlag_mine,
    UserCheckFlag_maybemie
}

export enum VisitFlagState {
    none,
    tryVisit,
    visited
}

export interface PointRng {
    x: number;
    y: number;
}
export function generateRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
* 生成0-nNumMax-1中n个不相同的随机数
* @param nNumMax
* @param nRandom
*/
export function generateSequenceN(nNumMax: number, nRandom: number): Array<number> {
    const arraytemp: Array<number> = [];
    for (let i = 0; i < nNumMax; ++i) {
        arraytemp.push(i);
    }
    for (let k = 0; k < nRandom; ++k) {
        const TempRandom = generateRandom(0, nNumMax - 1 - k);
        const Temp = arraytemp[TempRandom];
        arraytemp[TempRandom] = arraytemp[nNumMax - 1 - k];
        arraytemp[nNumMax - 1 - k] = Temp;
    }
    return arraytemp.slice(nNumMax - nRandom);
}
/**
 * 计算向量的叉积 p0p1 * p0p2，如果叉积大于0则 p0p1 在 p0p2的顺时针方向
 * @param p0 起始点
 * @param p1 向量1终点
 * @param p2 向量2终点
 */
export function cross(p0: PointRng, p1: PointRng, p2: PointRng) {
    return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
}
export function CheckPointInRng(arrayRng: Array<PointRng>, pointTocheck: PointRng) {
    if (arrayRng.length < 3) {
        return false;
    }
    let nEndPointIndex = arrayRng.length - 1;
    if (cross(arrayRng[0], pointTocheck, arrayRng[1]) > 0) {
        return false;
    }
    if (cross(arrayRng[0], pointTocheck, arrayRng[nEndPointIndex]) < 0) {
        return false;
    }
    let nStartIndex = 0;
    let nMiddle = 0;
    while (nStartIndex < nEndPointIndex) {
        nMiddle = Math.floor((nStartIndex + nEndPointIndex) / 2);
        if (cross(arrayRng[0], pointTocheck, arrayRng[nMiddle]) > 0) {
            nEndPointIndex = nMiddle;
        } else {
            if (nStartIndex === nMiddle) {
                break;
            } else {
                nStartIndex = nMiddle;
            }
        }
    }
    const Temp = cross(arrayRng[nStartIndex], pointTocheck, arrayRng[nStartIndex + 1]);
    return Temp < 0;
}
