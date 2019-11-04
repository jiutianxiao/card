// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import dataBus from "dataBus"

cc.Class({
    extends: cc.Component,

    properties: {
        butP1: cc.Sprite,
        butP2: cc.Sprite,
        butR: cc.Sprite,
        p0: cc.Node,
        p1: cc.Node,
        p2: cc.Node,
        p3: cc.Node,
        pP0: cc.Label,
        pL0: cc.Label,
        pS0: cc.Label,
        pP1: cc.Label,
        pL1: cc.Label,
        pS1: cc.Label,
        pP2: cc.Label,
        pL2: cc.Label,
        pS2: cc.Label,
        pP3: cc.Label,
        pL3: cc.Label,
        pS3: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bandData();
        this.butP1.node.on(cc.Node.EventType.TOUCH_END, () => {
            wx.sendSocketMessage({data: JSON.stringify({state: 6, index: dataBus.index})});
            dataBus.rest=false;
        });
        this.butP2.node.on(cc.Node.EventType.TOUCH_END, () => {
            wx.sendSocketMessage({data: JSON.stringify({state: 6, index: dataBus.index})});
            dataBus.rest=false;
        });
        this.butR.node.on(cc.Node.EventType.TOUCH_END, () => {
            new Promise((resolve, reject) => {
                wx.sendSocketMessage({data: JSON.stringify({state: 6, index: dataBus.index})});
                wx.closeSocket();
                wx.onSocketClose(function (res) {
                    resolve();
                });

            }).then(() => {
                dataBus.state = "quickStart";
                // dataBus.openState = "invitationbut";
                dataBus.rest=false;
                dataBus.createdSocket();
                wx.onSocketOpen(data => {
                    wx.sendSocketMessage({data: JSON.stringify({state: 1})})
                });
            });
        });
        console.log(this.butP1);
    },

    start() {
        /*        this.butP1.on(cc.Node.EventType.TOUCH_END, this.plan);
                this.butP2.on(cc.Node.EventType.TOUCH_END, this.plan);
                this.butR.on(cc.Node.EventType.TOUCH_END, this.reset);*/
    },
    plan() {
        console.log("准备");
        dataBus.rest=false;
        // wx.sendSocketMessage({data: JSON.stringify({state: 2, cards: null, index: dataBus.index})});
    },
    reset() {
        console.log("换桌");
        dataBus.rest=false;

        // wx.sendSocketMessage({data: JSON.stringify({state: 6, cards: null, index: dataBus.index})});
    },
    bandData() {
        let {lowOrWin: {people, win}, position, banker, spade} = dataBus;
        // let ary = {"top": "对家", "left": "上家", "my": "自己", "right": "下家"};
        let obj = {0: 0, 1: 1, 2: 2, 3: 3};
        if (win) {
            for (let i = 0; i < people.length; i++) {
                delete obj[people[i]];
                this.voluation(i, position[people[i]], "胜");
            }
            let keys = Object.keys(obj);
            let L = people.length;
            for (let i = L; i < 4; i++) {
                this.voluation(i, position[keys[i - L]], "负");
            }

        } else {
            for (let i = 0; i < 4; i++) {
                this.voluation(i, position[i], "平");
            }
        }

    },
    voluation(i, id, state) {
        let {banker, spade} = dataBus;
        let ary = {"top": "对家", "left": "上家", "my": "自己", "right": "下家"};
        this["pP" + i].string = ary[id];
        this["pL" + i].string = state;
        if (id === banker) {
            this["pS" + i].string = "庄";
        } else if (id === spade.index) {
            this["pS" + i].string = "黑五";
        } else {
            this["pS" + i].string = "平家";
        }
    },
    update(dt) {
        if (dataBus.rest) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    },
});
