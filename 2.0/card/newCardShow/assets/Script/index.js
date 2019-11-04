// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import requset from "./request"
import dataBus from "./dataBus";
cc.Class({
    extends: cc.Component,
    properties: {
        but: cc.Node,
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
        let hash = location.hash;
        hash = hash ? /=(\d+)/.exec(hash)[1] : null
        if (hash) {
            dataBus.houseIndex = hash;
            location.hash = "";
            dataBus.model = {
                updata: true,
                active: "conduct"
            }
            requset.socket();
        } else {
            this.but.on(cc.Node.EventType.TOUCH_END, () => {
                dataBus.model = {
                    updata: true,
                    active: "conduct"
                }
                requset.gethouse({
                    after: requset.socket
                });
            })
        }
    },

    // update (dt) {},
});
