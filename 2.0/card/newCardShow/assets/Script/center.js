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
        cards: cc.Node,
        addBut: cc.Node,
        no: cc.Node,
        yes: cc.Node,
        centerBut: cc.Node,
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
        this.no.active = false;
        this.yes.active = false;
        this.centerBut.active = false;
        this.addBut.active = true;
        this.addBut.on(cc.Node.EventType.TOUCH_END, () => {
            // if (wx) {
            //     wx.shareAppMessage({ title: "三缺一，速来", query: "houseIndex=" + dataBus.houseIndex })
            // } else
            {
                console.log("http://localhost:7456/#houseIndex=" + dataBus.houseIndex);
            }
        })
        this.no.on(cc.Node.EventType.TOUCH_END, () => {
            this.sendData()
        })
        this.yes.on(cc.Node.EventType.TOUCH_END, () => {
            console.log(dataBus.eleCards.template)
            if (dataBus.eleCards.template) {
                let cards = Object.keys(dataBus.eleCards.template);
                this.sendData(cards)
            } else {
                this.error = { active: true, text: data.msg, route: null };

            }
        })
        this.centerBut.on(cc.Node.EventType.TOUCH_END, () => {
            console.log(dataBus.eleCards.template)
            if (dataBus.eleCards.template) {
                let cards = Object.keys(dataBus.eleCards.template);
                this.sendData(cards)
            } else {
                this.error = { active: true, text: "请选择要出的牌", route: null };

            }
        })
    },
    sendData(cards = []) {
        dataBus.socket.send(JSON.stringify({
            code: "1003",
            houseIndex: dataBus.houseIndex,
            id: localStorage.getItem("userId"),
            index: dataBus.index,
            cards
        }))
    },
    update(dt) {
        if (dataBus.people === 4) {
            if (this.addBut.active) {
                this.addBut.active = false;
            }
            if (dataBus.activeIndex == dataBus.index) {
                if ((dataBus.lastIndex === "" && dataBus.index == dataBus.banker) || dataBus.activeIndex == dataBus.index && dataBus.lastIndex == dataBus.activeIndex) {
                    this.no.active = false;
                    this.yes.active = false;
                    this.centerBut.active = true;
                } else {
                    this.no.active = true;
                    this.yes.active = true;
                    this.centerBut.active = false;
                }
            } else {
                this.no.active = false;
                this.yes.active = false;
                this.centerBut.active = false;
            }
        } else if (!this.addBut.active) {
            this.addBut.active = true;
        }
    },
});
