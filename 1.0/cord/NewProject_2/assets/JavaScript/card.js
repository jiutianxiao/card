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

const flowerValue = ["black", "square", "plum", "peach"];
// const maxFlowerValue = ["Spade", "maxHeart", "maxPlum", "maxSquare"];
const numValue = {1: "A", 11: "J", 12: "Q", 13: "K"};
const fontColorValue = ["4d5357", "ff5a79"];
cc.Class({
    extends: cc.Component,

    properties: {
        cardLabel: cc.Label,
        peach: cc.Node,
        square: cc.Node,
        black: cc.Node,
        plum: cc.Node,
    },
    flag:false,
    // LIFE-CYCLE CALLBACKS:
    onLoad() {

    },
    start() {
    },
    setY() {
        if(this.flag){
            console.log(this.node.y);
        }
    },
    setNum(num, size, type) {

        let {height, width, fontSize, lineHeight, x, y} = size;
        this.node.width = width;
        this.node.height = width / 0.78;
        this.cardLabel.fontSize = fontSize;
        this.cardLabel.lineHeight = lineHeight;
        this.cardLabel.node.setPosition(x, y);


        this.peach.active = false;
        this.square.active = false;
        this.black.active = false;
        this.plum.active = false;

        let value = Math.ceil(num / 4);
        //花色
        let flower = num % 4;
        //颜色
        let color = flower % 2;

        if (numValue[value]) value = numValue[value];
        this.cardLabel.string = value;
        this.cardLabel.node.color = new cc.color(fontColorValue[color]);
        this[flowerValue[flower]].active = true;


        let min = this[flowerValue[flower]].children[0];
        let max = this[flowerValue[flower]].children[1];

        min.width = fontSize * .8;
        min.height = fontSize * .8;
        max.width = fontSize * 1.8;
        max.height = fontSize * 1.8;
        min.setPosition(x, y - fontSize * .8)

    }
});
