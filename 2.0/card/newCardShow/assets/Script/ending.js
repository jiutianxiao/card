import dataBus from "./dataBus";

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
        item0: cc.Label,
        item1: cc.Label,
        item2: cc.Label,
        item3: cc.Label,
        backBut: cc.Node,
        resBut: cc.Node,
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
        this.backBut.on(cc.Node.EventType.TOUCH_END, () => {
            dataBus.socket.send(JSON.stringify({
                code: "1010",
                houseIndex: dataBus.houseIndex,
                id: localStorage.getItem("userId"),
            }))
        })
        this.resBut.on(cc.Node.EventType.TOUCH_END, () => {
            dataBus.socket.send(JSON.stringify({
                code: "1004",
                houseIndex: dataBus.houseIndex,
            }))
        })
    },

    update(dt) {
        if (dataBus.ending.updata) {
            dataBus.ending.updata = false;
            let stateAry = { 1: "胜", 2: "平" }
            let state = "";
            let ending = dataBus.ending
            for (let i = 0; i < 4; i++) {
                let temp = "" + i;
                ending.ends.includes(temp) ? null : ending.ends.push(temp);
            }
            for (let i in ending.ends) {
                let str = `         ${dataBus.manIndex[ending.ends[i]] || "自己"}            ${i == dataBus.banker ? "庄家" : i == dataBus.spade ? "黑五" : "平家"}`
                if (ending.state == 1) {
                    if (ending.win.includes(ending.ends[i])) {
                        str = `胜利` + str;
                    } else {
                        str = `失败` + str;
                    }
                    this["item" + i].string = str
                } else {
                    this["item" + i].string = `平` + str
                }
            }
        }
    },
});
