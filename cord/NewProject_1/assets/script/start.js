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
        openBut: cc.Node,
        quickBut: cc.Node,
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
        this.openBut.on(cc.Node.EventType.TOUCH_END,
            () => {
                dataBus.state = "openHouse";
                dataBus.gameState.invitation = 1;
            }
        );
        this.quickBut.on(cc.Node.EventType.TOUCH_END,
            () => {
                dataBus.state = "quickStart";
                dataBus.gameState.invitation = 0;
            }
        );
        // let openBut=cc.instantiate(this.openBut);
        //
        // openBut.getComponent("openBut").setLabel("max","快速开始");
    },

    update(dt) {
        /*        if (dataBus.state === "start") {
                    this.node.active = true;
                } else this.node.active = false;*/
    },
});
