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
        timeLabel: cc.Label
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
    time: null,
    setTimeStart(flag) {
        console.log(flag);
        let distance = 30;
/*
        if (flag) {
            this.time = window.setInterval(() => {
                this.timeLabel.string = distance;
                if (distance === 0) {
                    if (distance === 0) {
                        dataBus.times = 0;
                        dataBus.app.send({state: 4, index: dataBus.nextIndex});
                    }
                    distance = 30;
                } else {
                    --distance;
                }
            }, 1000)
        } else {
            window.clearInterval(this.time);
        }
*/

    },
    start() {

    },

    // update (dt) {},
});
