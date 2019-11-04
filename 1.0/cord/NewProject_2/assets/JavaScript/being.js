// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
//

import dataBus from "./dataBus";

cc.Class({
    extends: cc.Component,

    properties: {
        rightBut: cc.Node,
        leftBut: cc.Node,
        centerBut: cc.Node,
        timeObj: cc.Node,
        text: cc.Label,
        endLabel: cc.Label,
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

    // onLoad () {},

    start() {
        this.endLabel.node.active = false;
        this.rightBut.on("touchstart", () => {
            let {app, index, tempCards: cards} = dataBus;
            if (cards.length)
                app.send({state: 3, data: {index, cards}});
            // dataBus.tempCards = [];
        });
        this.centerBut.on("touchstart", () => {
            let {app, index, tempCards: cards} = dataBus;
            // let cards = tempCards.slice();
            if (cards.length)
                app.send({state: 3, data: {index, cards}});
        });
        this.leftBut.on("touchstart", () => {
            let {app, index} = dataBus;
            // let cards = tempCards.slice();
            app.send({state: 3, data: {index, cards: []}});
        });
        console.log(dataBus.app);
    },

    update(dt) {
        if (dataBus.centerCards.update) {
            let {current, index, nextIndex} = dataBus;
            this.rightBut.active = false;
            this.leftBut.active = false;
            this.centerBut.active = false;
            this.timeObj.active = false;
            if ((nextIndex === index && current === index) || dataBus.newC) {
                if(dataBus.newC){
                    this.endLabel.node.active = true;
                }
                dataBus.newC = false;
                this.rightBut.active = false;
                this.leftBut.active = false;
                this.centerBut.active = true;
                this.timeObj.active = true;
            } else if (nextIndex === index && current !== index) {
                this.rightBut.active = true;
                this.leftBut.active = true;
                this.centerBut.active = false;
                this.timeObj.active = true;
            }
            if (dataBus.text.update) {
                dataBus.text.update = false;
                this.text.string = dataBus.text.text;
            }
        }

    },
});
