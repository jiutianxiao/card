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
    cordHeight: null,
    cordX: null,
    properties: {
        // cord: cc.Sprite
        card: cc.Prefab,
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
        this.init();
        /*        if(dataBus.openState==="invitationbut"){
                    this[""]
                }*/
        // this.draw();
    },
    init() {
        let {height} = this.node;
        let cordHeight = height;
        let cordWidth = cordHeight * .8;
        dataBus.card.max.height = cordHeight;
        dataBus.card.max.width = cordWidth;
        dataBus.card.max.fontSize = cordHeight * .2;
        this.cordHeight = cordHeight;
        this.cordX = cordWidth / 4;
    },
    draw() {
        this.node.removeAllChildren();
        let {cards} = dataBus.myCard;
        let cordX = this.cordX;
        let cardL = cards.length;
        let startX = -cordX * (cardL + 3) / 2;
        for (let i = 0; i < cardL; i++) {
            let cord = cc.instantiate(this.card);
            this.node.addChild(cord);
            cord.setPosition(startX, this.cordHeight / 2);
            startX += cordX;
            cord.getComponent("card").setNum(cards[i], true);
        }
    },
    update(dt) {
        if (dataBus.myCard.update) {
            console.log(1);
            this.draw();
            dataBus.myCard.update = false;
        }
    },
});
