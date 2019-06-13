//牌型
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
    if ((current.cardType === 5 || current.cardType === 6) && current.cardType > last.cardType) return true;
    return false;
};
// console.log(contrast({cardType: 2, L: 2, value: 1}, {cardType: 1, L: 1, value: 13}));

// 生成牌
function createRandom(num, min, max) {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];


    let res = [], newArr;
    newArr = Object.assign([], arr);
    for (let item = 0; item < arr.length; item++) {
        let num = Math.floor(Math.random() * newArr.length);
        res.push(newArr.splice(num, 1)[0]);
    }
    // res.length = num;

    var ary = [[], [], [], []];
    for (var i = -1; i < 48;) {
        ary[0].push(res[++i]);
        ary[1].push(res[++i]);
        ary[2].push(res[++i]);
        ary[3].push(res[++i]);
    }
    return ary;
}

// 判断下家
function nextCard(cards, index) {
    for (i = 0; i < cards.length; i++) {
        index = ++index === 4 ? 0 : index;
        if (cards[index].length) return index;
    }
}

/*
* 判断胜负
* state 0->没有结束 1->胜负 2->平局
* */
function victoryOrDefeat(banker, five, cards, ends) {
    if (banker === five && !cards[five].length) return {state: 1, win: [banker]};
    if (banker !== five) {
        if (ends.length === 2) {
            if ((ends.includes(banker) && ends.includes(five)) || (!ends.includes(banker) && !ends.includes(five))) return {
                state: 1,
                win: [...ends]
            };
        }
        else if (ends.length >= 2) {
            let bankerIndex = ends.indexOf(banker);
            let fiveIndex = ends.indexOf(five);
            if (fiveIndex > -1 && bankerIndex > -1) {
                if (fiveIndex === 0 || bankerIndex === 0) {
                    return {
                        state: 1,
                        win: [banker, five]
                    };
                } else {
                    return {
                        state: 2,
                        win: [...ends]
                    };
                }
            } else {
                if (fiveIndex !== 0 && bankerIndex !== 0) {
                    ends = ends.filter((item, index) => item !== banker && item !== five);
                    return {
                        state: 1,
                        win: [...ends]
                    };
                } else {
                    return {
                        state: 2,
                        win: [...ends]
                    };
                }
            }
        }
    }
    return {
        state: 0,
        win: [...ends]
    }
}

module.exports = {compare, createRandom, contrast, nextCard,victoryOrDefeat};
