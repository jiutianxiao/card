// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        stuat: cc.Node,
        head: cc.Node,
        // time: cc.Node,
        text: cc.Label,
        num: cc.Label,
        banker: cc.Node,
        five: cc.Node
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
    setHead() {

    },
    setTimer(timer) {
        if (timer) {
            this.time.active = true;
            this.time.getComponent("times").setTimeStart(true);
        } else {
            this.time.getComponent("times").setTimeStart(false);
            this.time.active = false;
        }
    },
    setStuta({text, num, five, banker}) {
        if (text) this.text.string = text;
        else this.text.string = "";
        if (num) this.num.string = num;
        else this.num.string = 0;
        if (banker) this.banker.active = true;
        else this.banker.active = false;
        if (five) this.five.active = true;
        else this.five.active = false;

    },
    start() {

    },

    // update (dt) {},
});
