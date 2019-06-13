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
import tool from "../public"

cc.Class({
    extends: cc.Component,

    properties: {
        index: cc.Node,//首页
        invitation: cc.Node,//邀请好友
        being: cc.Node,//游戏进行时
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.being.active = false;
        this.invitation.active = false;
        this.index.active = false;
    },

    start() {
        let signal = new tool.SOCKET();
        dataBus.app = signal.CreateWebSocket("ws://127.0.0.1:3000/test/123");
        dataBus.app.message(data => {
            data = JSON.parse(data.data);
            if (data.state === 3) {
                let {data: {index, cards, nextIndex, card, newC}} = data;
                dataBus.nextIndex = nextIndex;
                console.log(dataBus);
                if (index === dataBus.index) {
                    dataBus.tempCards = [];
                }
                dataBus.consult[index] ? dataBus[dataBus.consult[index]].update = true : "";
                if (cards.length) {
                    dataBus.current = index;
                    dataBus.centerCards = {
                        cards,
                        update: true
                    };
                    if (dataBus.consult[index]) {
                        dataBus[dataBus.consult[index]].cards = card;
                    } else {
                        dataBus.cards = {
                            cards: card,
                            update: true
                        }
                    }
                    for (let key in dataBus.consult) {
                        dataBus[dataBus.consult[key]].text = "";
                        dataBus[dataBus.consult[key]].update = true;
                    }
                    dataBus.text.text = "";
                    dataBus.text.update = true;
                } else {
                    if (nextIndex === dataBus.current) {
                        dataBus.centerCards.cards = [];
                    }

                    dataBus.centerCards.update = true;
                    if (index === dataBus.index) {
                        dataBus.text.text = "不出";
                        dataBus.text.update = true;
                    } else
                        dataBus[dataBus.consult[index]].text = "不出";

                    if (newC) {
                        dataBus.newC = true;
                        dataBus.centerCards.cards = [];
                        for (let key in dataBus.consult) {
                            dataBus[dataBus.consult[key]].text = "";
                            dataBus[dataBus.consult[key]].update = true;
                        }
                        dataBus.text.text = "";
                        dataBus.text.update = true;
                    }
                }

            }
        })
    },

    update(dt) {
        let {mode} = dataBus;
        if (mode.update) {
            this.being.active = false;
            this.invitation.active = false;
            this.index.active = false;
            mode.update = false;
            this[mode.page].active = true;
        }
    },
});
