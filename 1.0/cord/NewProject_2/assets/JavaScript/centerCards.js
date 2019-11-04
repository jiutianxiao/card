// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import dataBus from "./dataBus"

cc.Class({
    extends: cc.Component,

    properties: {
        card: cc.Prefab,
        right: cc.Node,
        left: cc.Node,
        top: cc.Node,
        my: cc.Node,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    size: null,
    cardY: null,
    touchStart: null,
    cardSize() {
        let {height} = this.node;
        height = height * .9;
        let width = height * .8;
        let fontSize = height * .22;
        let lineHeight = height * .2 + 4;
        let x = (fontSize - width) / 2 + (fontSize * .15);
        let y = width / 2 - fontSize * .3;
        return {height, width, fontSize, lineHeight, x, y};
    },
    start() {
        if (this.node.name === "cards") {
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    },
    onTouchStart(e) {
        let start = e.getLocation();
        this.touchStart = start.x;
    },
    onTouchMove(e) {
        if (!this.touchStart) return;
        let hit = this.node._hitTest(e.getLocation());
        if (hit) {
            //move到了该node里面
        } else {
            // touchStart.log
            /* let endP = e.getLocation();
             this.meter(this.touchStart, endP.x);*/
            this.touchStart = null;
            //move 到了该node外面
        }
        // }, this);
    },
    onTouchEnd(e) {
        let endP = e.getLocation();
        this.meter(this.touchStart, endP.x);
        this.touchStart = null;
    },
    //计算坐标相对于牌的位置
    meter(startP, endP) {
        let cardNum = 4;
        let {width: cardWidth} = this.size;
        let step = cardWidth / 4;
        let {width} = this.node;
        let startX = width / 2 - step * (dataBus.cards.cards.length + 3) / 2;
        let endX = width - startX;
        if (endP < startP) {
            let x = endP;
            endP = startP;
            startP = x;
        }
        let range = endP - startP;
        let cardsNum = dataBus.cards.cards.length - 1;
        if (startP < startX && endP > endX) {
            this.cardUpDown(0, cardsNum);
        } else if (startP < startX && endP > startX) {
            let range = endP - startX;
            let num = Math.floor(range / step);
            num = num > cardsNum ? cardsNum : num;
            this.cardUpDown(0, num);
        } else if (endP > endX && startP < endX) {
            let num = Math.floor((startP - startX) / step);
            num = num > cardsNum ? cardsNum : num;
            this.cardUpDown(num, cardsNum);
        } else if (startP > startX && endP < endX) {
            let startIndex = Math.floor((startP - startX) / step);
            if (startIndex >= cardsNum) {
                startIndex = startIndex > cardsNum ? cardsNum : startIndex;
                this.cardUpDown(startIndex, cardsNum);
            } else {
                let endIndex = Math.floor((endP - startX) / step);
                endIndex = endIndex > cardsNum ? cardsNum : endIndex;
                this.cardUpDown(startIndex, endIndex);
            }
        }
        /*else if (endP > endX) {
                   let range = (endX) - startP;
                   num = range / step;
                   num = num > 13 ? 13 : num;
               } else {
                   let range = endP - startP;
                   num = range / step;
                   num = num > 13 ? 13 : num;
               }*/
    },

    cardUpDown(start, end) {
        let eleChildren = this.node.children;
        // end = end >= eleChildren.length ? eleChildren.length - 1 : end;
        let {cards} = dataBus.cards;
        for (; start <= end; start++) {
            let y = null;
            if (!eleChildren[start].upDown) {
                if (!this.cardY) this.cardY = eleChildren[start].y;
                y = eleChildren[start].height / 10;
                eleChildren[start].upDown = true;
                dataBus.tempCards.push(cards[start]);
            } else {
                y = this.cardY;
                eleChildren[start].upDown = false;
                dataBus.tempCards = dataBus.tempCards.filter(item => {
                    return item !== cards[start];
                })
            }
            eleChildren[start].y = y
        }
    },
    cardsAry(ary, range) {
        if (!this.size) {
            this.size = this.cardSize();
        }
        let {width: cardWidth} = this.size;
        let {height} = this.node;
        let {length: lg} = ary;
        let step = cardWidth / 4;
        let startX = -step * (lg - 1) / 2;
        ary = ary.sort((a, b) => a - b);
        this.node.removeAllChildren();
        dataBus.eleCards = [];
        ary.forEach((item) => {
            let cardEle = cc.instantiate(this.card);
            cardEle.getComponent("card").setNum(item, this.size, true);
            cardEle.setPosition(startX, -height);
            startX += step;
            dataBus.eleCards.push(cardEle);
            this.node.addChild(cardEle);
        });
    },
    update(dt) {
        if (this.node.name === "cards" && dataBus.cards.update) {
            dataBus.cards.update = false;
            dataBus.cards.cards && this.cardsAry(dataBus.cards.cards);
        } else if (this.node.name === "centerCards" && dataBus.centerCards.update) {
            let {consult, nextIndex} = dataBus;
            for (let key in consult) {
                let flag = false;
                if (key == nextIndex) {
                    flag = true;
                }
                this[consult[key]].active = flag;
                this[consult[key]].getComponent("times").setTimeStart(flag);
            }
            let flag = false;
            if (!consult[nextIndex]) {
                flag = true;
            }
            this.my.active = flag;
            this.my.getComponent("times").setTimeStart(flag);
            dataBus.centerCards.update = false;
            dataBus.centerCards.cards && this.cardsAry(dataBus.centerCards.cards);
        }
    },
});
