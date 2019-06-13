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
        top: cc.Node,
        right: cc.Node,
        left: cc.Node,
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

    },

    update(dt) {
        if (dataBus.right.update) {
            dataBus.right.update = false;
            let {banker, spade, cf, current, nextIndex, right: {cards, text}} = dataBus;
            this.right.getComponent("headPortrait").setStuta(
                {
                    banker: banker === cf.right,
                    five: spade === cf.right,
                    num: cards,
                    text: text,
                }
            )
        }
        if (dataBus.top.update) {
            dataBus.top.update = false;
            let {banker, spade, cf, current, nextIndex, top: {cards, text}} = dataBus;
            this.top.getComponent("headPortrait").setStuta(
                {
                    banker: banker === cf.top,
                    five: spade === cf.top,
                    num: cards,
                    text: text,
                }
            )
        }
        if (dataBus.left.update) {
            dataBus.left.update = false;
            let {banker, spade, cf, current, nextIndex, left: {cards, text}} = dataBus;
            this.left.getComponent("headPortrait").setStuta(
                {
                    banker: banker === cf.left,
                    five: spade === cf.left,
                    num: cards,
                    text: text,
                }
            )
        }
    },
});
