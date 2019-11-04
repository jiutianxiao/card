// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const COLOR = ["#4d5357", "#ff5a79"];
const NUMTRANFROM = { 1: "A", 11: "J", 12: "Q", 13: "K" }
let SHAPE = ["spade", "heart", "plum", "square"]
// let SHAPE = ["spade", "heart", "square", "plum"]
cc.Class({
    extends: cc.Component,

    properties: {
        lable: cc.Label,
        heart: cc.Sprite,//红桃
        min_heart: cc.Sprite,
        plum: cc.Sprite,//方片
        min_plum: cc.Sprite,
        spade: cc.Sprite,//黑桃
        min_spade: cc.Sprite,//
        square: cc.Sprite,//梅花
        min_square: cc.Sprite,
        actived: false,
        tag: false
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
    setN(num) {
        this.lable.string = NUMTRANFROM[num] || num
    },
    setNum({ num, actived, size: { height, width } }) {
        // console.log({ num, active, size: { height, width } })3
        this.actived = actived;
        this.spade.node.active = false;
        this.heart.node.active = false;
        this.plum.node.active = false;
        this.square.node.active = false;
        this.min_spade.node.active = false;
        this.min_heart.node.active = false;
        this.min_plum.node.active = false;
        this.min_square.node.active = false;


        this.node.width = width;
        this.node.height = height;
        let value = Math.ceil(num / 4)
        this.lable.string = NUMTRANFROM[value] || value;
        let fontSize = height * .2;
        this.lable.fontSize = fontSize;
        this.lable.y = height * .02
        this.lable.node.parent.width = fontSize * 1.5
        this.lable.node.parent.y = fontSize * .5
        this.lable.node.color = new cc.color(COLOR[num % 2])
        this.lable.lineHeight = fontSize + 2;
        this.lable.lineHeight = fontSize + 2;
        let tranfrom = this[SHAPE[num % 4]].node
        tranfrom.active = true;
        tranfrom.width = width * .5;
        tranfrom.height = width * .5;
        let min = this["min_" + SHAPE[num % 4]].node;
        min.active = true;
        min.y = -(height * .02 + fontSize + 2 + fontSize * .3);
        min.height = fontSize;
        min.width = fontSize;
        min.x = -fontSize * .7
    },
    setPint(num) {
        this.tag = !this.tag;
        if (this.actived)
            if (this.tag) {
                this.node.y += 20;
            } else {
                this.node.y -= 20;
            }
    }
    // update (dt) {},
});
