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
        text: cc.Label
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
        console.log(1)
        this.text.string = dataBus.err.text + " 3S";
        let i = 3
        dataBus.err.updata = false;
        let timer = setInterval(() => {
            i--;
            this.text.string = dataBus.err.text + i + "S";
            if (i === 0) {
                window.clearInterval(timer);
                this.node.active = false;
                if (dataBus.err.route){
                    dataBus.model = { updata: true, active: dataBus.err.route };
                    dataBus.err.route = ""
                }
                dataBus.err.text = "";
            };
        }, 1000)
    },

    // update (dt) {},
});
