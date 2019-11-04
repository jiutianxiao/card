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
import dataBusInit from "./dataBusInit";
cc.Class({
    extends: cc.Component,

    properties: {
        index: cc.Node,
        conduct: cc.Node,
        error: cc.Node,
        help: cc.Node,
        helpClear: cc.Node,
        helpBut: cc.Node,
        ending: cc.Node,
        falg: true
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
        this.conduct.active = false;
        this.error.active = false;
        this.help.active = false;
        this.helpBut.on(cc.Node.EventType.TOUCH_END, () => {
            this.help.active = true;
        })
        this.helpClear.on(cc.Node.EventType.TOUCH_END, () => {
            this.help.active = false;
        })
    },
    socketMessage() {
        dataBus.socket.onmessage = (message) => {
            let data = JSON.parse(message.data);
            console.log(data)
            if (data.code === "2002") {
                let men = ["", "left", "top", "right"];
                data = data.data
                let index = data.index;
                dataBus.index = index;
                dataBus.banker = data.banker;
                dataBus.activeIndex = data.activeIndex;
                for (let i = 1; i < 4; i++) {
                    let key = null;
                    if (+index + i >= 4) {
                        key = +index + i - 4
                    } else key = +index + i
                    dataBus[men[i]] = {
                        updata: true,
                        cards: {
                            updata: true,
                            data: [],
                            text: "",
                            num: 13,
                        },
                        spade: false,
                        imageSrc: {
                            updata: true,
                        }
                    }
                    dataBus.manIndex[key] = men[i];
                    if (key == data.banker) dataBus[men[i]].banker = true
                    if (data.image[key]) {
                        dataBus[men[i]].imageSrc = { updata: true, data: data.image[key] }
                    }
                }
                dataBus.people = data.image.length;
                dataBus.myCards = {
                    updata: true,
                    cards: {
                        data: data.cards || [],
                        updata: true,
                    },
                    banker: index == data.banker ? true : false,
                    spade: index == data.banker ? data.cards.includes("20") : false,
                }
            } else if (data.code === "2003") {
                let { cards, lastIndex, activeIndex } = data;
                dataBus.activeIndex = activeIndex;
                let spade = cards.includes("20");
                if (activeIndex == dataBus.index) {
                    dataBus.center = {
                        updata: true,
                        "cards": {
                            updata: true,
                            data: [],
                            text: "",
                        },
                    }
                    dataBus.eleCards.template = null;
                } else {
                    dataBus[dataBus.manIndex[activeIndex]].cards.updata = true;
                    dataBus[dataBus.manIndex[activeIndex]].cards.text = "";
                    dataBus[dataBus.manIndex[activeIndex]].cards.data = [];
                }
                if (lastIndex == dataBus.index && !cards.length) {
                    dataBus.center = {
                        updata: true,
                        cards: {
                            updata: true,
                            data: [],
                            text: "不出",
                        },
                    }
                }
                if (cards.length || lastIndex == activeIndex) {
                    dataBus.lastIndex = lastIndex;
                }
                if (!cards.length && dataBus.lastIndex != lastIndex && lastIndex == activeIndex) {
                    debugger
                    if (dataBus.index == lastIndex) {
                        dataBus.center = {
                            updata: true,
                            cards: {
                                updata: true,
                                data: [],
                                text: "已出完，等待中",
                            },
                        }
                    } else {
                        dataBus[dataBus.manIndex[lastIndex]].updata = true;
                        dataBus[dataBus.manIndex[lastIndex]].cards.updata = true;
                        dataBus[dataBus.manIndex[lastIndex]].data = [];
                        dataBus[dataBus.manIndex[lastIndex]].text = "已出完";
                    }

                }
                if (lastIndex == dataBus.index) {
                    dataBus.myCards.cards.data = dataBus.myCards.cards.data.filter(item => {
                        console.log(item, cards, cards.includes(item.toString()))
                        return !cards.includes(item.toString())
                    });
                    dataBus.myCards.cards.updata = true;
                    if (spade) {
                        dataBus.myCards.spade = spade;
                    }
                    dataBus.center = {
                        updata: true,
                        cards: {
                            updata: true,
                            data: cards,
                            text: cards.length ? "" : "不出",
                        },
                    }
                } else {
                    let cardsData = { updata: true, data: cards, num: +dataBus[dataBus.manIndex[lastIndex]].cards.num - cards.length, text: "不出" }
                    if (cards.length) {
                        cardsData.text = ""
                    }
                    if (spade) {
                        dataBus[dataBus.manIndex[lastIndex]].spade = spade;
                        dataBus[dataBus.manIndex[lastIndex]].updata = true;
                    }
                    dataBus[dataBus.manIndex[lastIndex]] = Object.assign(dataBus[dataBus.manIndex[lastIndex]], { updata: true, cards: cardsData })
                }
                console.log(dataBus)

            } else if (data.code === "2004") {
                let obj = { updata: true }
                obj = Object.assign(obj, data.data);
                dataBus.ending = obj;
                dataBus.model = {
                    updata: true,
                    active: "ending"
                }
            } else if (data.code === "2010") {
                // dataBus.model = {
                //     updata: true,
                //     active: ""
                // };
                dataBus.err = {
                    updata: true,
                    text: "有人退出房间，请重新开始",
                    route: "index"
                },
                    dataBusInit();

                dataBus.socket.close = () => {
                    Object.assign(dataBus, dataBusInit)
                }
            } else if (data.code === "0001") {
                this.error = { active: true, text: data.msg, route: "index" };
            } else if (data.code === "0002") {
                this.error = { active: true, text: data.msg, route: null };
            }

        }
    },
    update(dt) {
        if (dataBus.model.updata) {
            dataBus.model.updata = false;
            let model = ["index", "conduct", "ending"];
            for (let i of model) {
                this[i].active = false;
            }
            this[dataBus.model.active].active = true;
        }
        if (dataBus.socket && this.falg) {
            this.falg = false;
            this.socketMessage();
        }
        if (dataBus.err.updata) {
            console.log("eee")
            dataBus.err.updata = false;
            this["error"].active = true;
        }
    },
});
