//牌型
import dataBus from "../script/dataBus";

let cardType = {1: "单牌", 2: "对子", 3: "顺子", 4: "连对", 5: "炸弹", 6: "轰"};


//顺子判断
let cont = (cont) => {
    // if (cont.length < 3) return false;
    let contL = cont.length;
    for (let i = 0; i < contL - 1; i++) {
        if (cont[i] + 1 !== cont[i + 1]) {
            if (cont[i] !== 1 && cont[i] !== 4) return false;
            if (cont[i] === 1 && cont[contL - 1] !== 13) return false;
            if (cont[i] === 4 && cont[i + 1] !== 6) return false;
        }
    }
    if (cont[contL - 1] === 13 && cont[0] === 1) return {cardType: 3, length: contL, value: 1};
    return {cardType: 3, L: contL, value: cont[contL - 1]}
};

//连对判断
let EPair = (EPair) => {
    let Leg = EPair.length;
    if (EPair[0] !== EPair[1] || EPair[Leg - 1] !== EPair[Leg - 2]) {
        return false;
    }
    let ary = [[], []];
    for (let i = 0; i < Leg; i += 2) {
        if (EPair[i] !== EPair[i + 1]) return false;
        ary[0].push(EPair[i]);
        ary[1].push(EPair[i + 1]);
    }
    if (cont(ary[0]) && cont(ary[1])) {
        return {cardType: 4, L: Leg, value: EPair[Leg - 1]}
    }
    return false
};

//判断牌型
let compare = (current) => {
    let currL = current.length;
    if (currL === 0) return false;
    let currValue = [];
    current.sort((a, b) => a - b);
    //取值
    for (let i = 0; i < currL; i++) {
        if (i !== currL && current[i] === current[i + 1]) return false;
        currValue.push(Math.ceil(current[i] / 4));
    }
    if (currL !== 1) {

        //判断是否是对子
        if (currL === 2) {
            if (currValue[0] === currValue[1])
                return {cardType: 2, value: currValue[0]};
            return false
        }

        if (currL === 3) {
            //判断是否是炸弹
            if (currValue[0] === currValue[1] && currValue[0] === currValue[2]) {
                return {cardType: 5, value: currValue[0]};
            }
        }
        if (currL === 4) {
            //判断是否是轰
            if (currValue[0] === currValue[1] && currValue[0] === currValue[2] && currValue[0] === currValue[3]) {
                return {cardType: 6, value: currValue[0]};
            }
        }
        let returnValue = cont(currValue);
        if (returnValue) {
            return returnValue;
        }
        returnValue = EPair(currValue);
        if (EPair(currValue)) {
            return returnValue;
        }
        return false;
    }
    return {cardType: 1, L: 1, value: currValue[0]};
};

//规则
let contrast = (last, current) => {
    if (last.cardType === current.cardType && last.L === current.L) {
        let lastValue = null, currentValue = null;
        if (last.cardType === 3 || last.cardType === 4) {
            lastValue = last.value === 1 ? 14 : last.value;
            currentValue = current.value === 1 ? 14 : current.value;
        } else {
            let price = {1: 14, 2: 15, 3: 16, 5: 17};
            lastValue = price[last.value] || last.value;
            currentValue = price[current.value] || current.value;
        }
        if (currentValue > lastValue || (currentValue === 17 && lastValue === 17)) return true;
    }
    if ((current.cardType === 5 || cardType.cardType === 6) && current.cardType > last.cardType) return true;
    return false;
};
let upper = (val) => {
    val = val || 4;
    --val;
    if (dataBus.finishIndex.includes(val)) return upper(val);
    return val
};

let winOrLow = () => {
    /*
    * win 1胜，0平
    * people :[] 对象
    * */
    let {finishIndex, banker, spade, pFlip} = dataBus;
    banker = pFlip[banker];
    spade = pFlip[spade.index];
    if (finishIndex.length === 1 && banker === spade && finishIndex.includes(banker)) {
        return {
            win: 1,
            people: finishIndex
        }
    } else if (finishIndex.length === 2) {
        if (banker === spade) {
            if (finishIndex.includes(banker)) {
                return {
                    win: 0,
                }
            }
        } else if ((finishIndex.includes(banker) && finishIndex.includes(spade)) || (!finishIndex.includes(banker) && !finishIndex.includes(spade))) {
            return {
                win: 1,
                people: finishIndex
            }
        }
    } else if (finishIndex.length === 3) {
        if (banker === spade) {
            if (finishIndex.includes(banker)) {
                return {
                    win: 0,
                }
            } else {
                return {
                    win: 1,
                    people: finishIndex
                }
            }
        } else {
            if (finishIndex.includes(banker) && finishIndex.includes(spade)) {
                if (finishIndex.indexOf(banker) !== 0 && finishIndex.indexOf(spade) !== 0) {
                    return {
                        win: 0
                    }
                } else {
                    return {
                        win: 1,
                        people: [banker, spade]
                    }
                }
            } else {
                if (finishIndex.indexOf(banker) === 0 || finishIndex.indexOf(spade) === 0) {
                    return {
                        win: 0
                    }
                } else {
                    return {
                        win: 1,
                        people: [finishIndex[0], finishIndex[2]]
                    }
                }
            }
        }
    }
    return false
};
let numChange = (last, next) => {
//    last 上家 next 下家
    next = next === 0 ? 4 : next;
    if (next - last > 0) {
        return true
    }
    return false;
};
let numMid = (first, second, three, digit) => {
    for (let i = 0; i < digit; i++) {
        ++first;
        if (first === digit) first = 0;
        if (first === second) return true;
        if (first === three) return false;
    }
    return false;
};
export default {
    contrast,
    compare,
    upper,
    winOrLow,
    numChange,
    numMid,
}
// console.log(contrast({cardType: 1, L: 1, value: 12}, {cardType: 1, L: 1, value: 1}));
/*
console.log(compare([13, 20, 21]));
console.log(compare([52]));*/
