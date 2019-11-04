// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import dataBus from "./dataBus";

cc.Class({
    extends: cc.Component,

    properties: {
        card: cc.Prefab
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
    init() {
        let {height} = this.node;
        let cordWidth = height * .8;
        dataBus.card.min.height = height;
        dataBus.card.min.width = cordWidth;
        dataBus.card.min.fontSize = height * .2;
        this.cordHeight = height;
        this.cordX = cordWidth / 4;
    },
    draw() {
        this.node.removeAllChildren();
        let {cards} = dataBus.temp;
        let cordX = this.cordX;
        let cardL = cards.length;
        let startX = -cordX * (cardL + 3) / 2;
        for (let i = 0; i < cardL; i++) {
            let cord = cc.instantiate(this.card);
            this.node.addChild(cord);
            cord.setPosition(startX, this.cordHeight / 2);
            startX += cordX;
            cord.getComponent("card").setNum(cards[i], false);
        }
    },
    start() {
        this.init();
    },

    update(dt) {
        if (dataBus.temp.update) {
            this.draw();
            dataBus.temp.update = false;
        }
    },
});
