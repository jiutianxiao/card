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

//                  黑        红        梅        方
const flowerValue = ["spade", "heart", "plum", "square"];
const maxFlowerValue = ["maxSpade", "maxHeart", "maxPlum", "maxSquare"];
const numValue = {1: "A", 11: "J", 12: "Q", 13: "K"};
const fontColorValue = ["4d5357", "ff5a79"];
cc.Class({
    extends: cc.Component,
    properties: {
        Label: cc.Label,
        spade: cc.Sprite,
        maxSpade: cc.Sprite,
        plum: cc.Sprite,
        maxPlum: cc.Sprite,
        square: cc.Sprite,
        maxSquare: cc.Sprite,
        heart: cc.Sprite,
        maxHeart: cc.Sprite,

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
    setNum(num, type) {
        // num = 6;
        //牌面
        let value = Math.ceil(num / 4);
        //花色
        let flower = num % 4;
        //颜色
        let color = flower % 2;

        if (numValue[value]) value = numValue[value];
        this.Label.string = value;

        for (let i = 0; i < 4; i++) {
            if (i !== flower) {
                this[maxFlowerValue[i]].node.active = false;
                this[flowerValue[i]].node.active = false;
            }
        }

        this.Label.node.color = new cc.color(fontColorValue[color]);
        let selce = null;
        if (type) {
            let tag = true;
            this.node.on(cc.Node.EventType.TOUCH_START,
                (e) => {
                    if (tag) {
                        dataBus.myCard.tempCard.push(num);
                        this.node.y = this.node.y * 1.3;
                    }
                    if (!tag) {
                        let temp = [];
                        for (let i = 0, l = dataBus.myCard.tempCard.length; i < l; i++) {
                            if (dataBus.myCard.tempCard[i] !== num) {
                                temp.push(dataBus.myCard.tempCard[i]);
                            }
                        }
                        dataBus.myCard.tempCard = temp;
                        temp = null;
                        this.node.y = this.node.y / 1.3;
                    }
                    tag = !tag;
                });
            selce = "max";
        } else selce = "min";
        let {fontSize, height, width} = dataBus.card[selce];
        this.node.height = height;
        this.node.width = width;
        this.Label.fontSize = fontSize;
        this.Label.node.x = fontSize / 1.5;
        this.Label.node.y = -fontSize / 1.2;
        this[flowerValue[flower]].node.x = fontSize / 1.5;
        this[flowerValue[flower]].node.y = -fontSize / 1.2 * 2;
        this[flowerValue[flower]].node.width = fontSize * .8;
        this[flowerValue[flower]].node.height = fontSize * .8;
        this[maxFlowerValue[flower]].node.width = height * .4;
        this[maxFlowerValue[flower]].node.height = height * .4;


        // this[maxFlowerValue[flower]].node;
    },
    start() {
        // this.setNum();
        // console.log(width, height);
    }
    ,

// update (dt) {},
})
;
