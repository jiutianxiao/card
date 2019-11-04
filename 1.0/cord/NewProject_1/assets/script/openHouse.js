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
import tool from "../tool"

cc.Class({
    extends: cc.Component,
    properties: {
        invitationbut: cc.Node,
        topEle: cc.Node,
        rightEle: cc.Node,
        leftEle: cc.Node,
        myModular: cc.Node,
        playBut: cc.Node,
        topImg: cc.Sprite,
        rightImg: cc.Sprite,
        leftImg: cc.Sprite,
        topStartLable: cc.Label,
        rightStartLable: cc.Label,
        leftStartLable: cc.Label,
        myStartLable: cc.Label,
        rightCardNum: cc.Label,
        leftCardNum: cc.Label,
        topCardNum: cc.Label,
        tipsLable: cc.Label,

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

    onLoad() {
        if (dataBus.openState === "invitationbut") {
            this.invitationbut.active = true;
        } else {
            this.invitationbut.active = false;
        }
        let ele = this;
        this.init();
        this.payButFn();
    },

    start() {

    },
    headImg(ele, src) {
        let imgUrl = src + "?aa=aa.jpg";
        cc.loader.load(imgUrl, (err, texture) => {
            this[ele + "Img"].spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    payButFn() {
        this.playBut.children[0].on(cc.Node.EventType.TOUCH_END, function () {
            wx.sendSocketMessage({data: JSON.stringify({state: 3, cards: null, index: dataBus.index})});
            // tool.last(dataBus);
        });
        this.playBut.children[1].on(cc.Node.EventType.TOUCH_END, this.sendCard.bind(this));
        this.playBut.children[2].on(cc.Node.EventType.TOUCH_END, this.sendCard.bind(this));
    },
    sendCard() {
        if ((!dataBus.temp.dealer && dataBus.banker === "my") || (dataBus.temp.dealer === "my") || !dataBus.temp.cards.length) {
            if (tool.compare(dataBus.myCard.tempCard)) {
                wx.sendSocketMessage({
                    data: JSON.stringify({
                        state: 3,
                        cards: dataBus.myCard.tempCard,
                        index: dataBus.index
                    })
                })
            } else {
                this.tipsLable.node.active = true;
                setTimeout(() => {
                    this.tipsLable.node.active = false;
                }, 3000)
            }
        } else {
            let myCard = tool.compare(dataBus.myCard.tempCard);
            let tempCard = tool.compare(dataBus.temp.cards);
            if (tool.contrast(tempCard, myCard)) {
                wx.sendSocketMessage({
                    data: JSON.stringify({
                        state: 3,
                        cards: dataBus.myCard.tempCard,
                        index: dataBus.index
                    })
                })
            } else {
                this.tipsLable.node.active = true;
                setTimeout(() => {
                    this.tipsLable.node.active = false;
                }, 3000)
            }
        }
    },
    init() {
        this.tipsLable.node.active = false;
        if (dataBus.gameState.invitation && (!dataBus.top.src || !dataBus.left.src || !dataBus.right.src)) {
            this.myModular.active = false;
            this.invitationbut.active = true;
            this.invitationbut.on(cc.Node.EventType.TOUCH_END, () => {
                this.myModular.active = true;
                this.invitationbut.active = false;
            })
        } else {
            this.myModular.active = true;
            this.invitationbut.active = false;
        }
    },
    head() {
        let ary = ["my", "right", "top", "left"];
        ary.map((item) => {
            let temp = item;
            if (item === "my") {
                temp = "myCard";
            }
            if (dataBus[temp]["update"]) {
                dataBus[item]["update"] = false;

                if (dataBus[item].src) {
                    this.headImg(item, dataBus[item].src);
                }
                if (item === "my") {
                    if (dataBus["myCard"]["state"] === 0) {
                        this[item + "StartLable"]["string"] = "";
                    } else if (dataBus["myCard"]["state"] === 1) {
                        this[item + "StartLable"]["string"] = "准备";
                    } else if (dataBus["myCard"]["state"] === 2) {
                        this[item + "StartLable"]["string"] = "不出";
                    }
                } else {
                    if (dataBus[item]["state"] === 0) {
                        this[item + "StartLable"]["string"] = "";
                    } else if (dataBus[item]["state"] === 1) {
                        this[item + "StartLable"]["string"] = "准备";
                    } else if (dataBus[item]["state"] === 2) {
                        this[item + "StartLable"]["string"] = "不出";
                    }
                }

                if (item !== "my") {
                    let str = "";
                    if (dataBus["banker"] === item) {
                        str = "庄家 "
                    }
                    str += "牌:";
                    str += dataBus[item]["cardNum"] ? dataBus[item]["cardNum"] : 0;
                    if (dataBus["spade"].state === 1 && dataBus["spade"]["index"] === item) {
                        str = " ♠"
                    }
                    this[item + "CardNum"]["string"] = str;
                }
            }
        });
    },
    playCard() {
        /*dataBus.temp.lastIndex === dataBus.temp.last
        && dataBus.temp.index - dataBus.temp.lastIndex > 0*/
        let {temp, positionIndex, upper, index, banker, finishIndex} = dataBus;
        let tempLast = null;
        if (finishIndex.includes(upper + 1)) {
            tempLast = upper + 2;
        } else tempLast = upper + 1;
        tempLast = tempLast === 4 ? 0 : tempLast;
        // if (temp.cards.length !== 0 && (upper === temp.lastIndex && temp.index !== index || /*temp.index === temp.lastIndex && tempLast === temp.lastIndex ||*/ temp.lastIndex === upper && tool.numChange(temp.lastIndex, index) || index !== temp.lastIndex && tool.numChange(temp.lastIndex, index) && tool.numChange(upper, temp.lastIndex))) {
        if (temp.cards.length !== 0 && temp.index !== index && (temp.lastIndex === upper || index !== temp.lastIndex && tool.numMid(upper, temp.lastIndex, index, 4))) {
            this.playBut.active = true;
            this.playBut.children[2].active = false;
            this.playBut.children[1].active = true;
            this.playBut.children[0].active = true;
        } else if (index === temp.index && temp.dealer === "my" && upper === temp.lastIndex || banker === "my" && temp.lastIndex === "" || (upper === temp.lastIndex && temp.index !== index || tool.numChange(upper, temp.index) && tool.numChange(temp.lastIndex, temp.index) && !temp.cards.length)/*||(temp.index - dataBus.temp.lastIndex > 0 && temp.lastIndex === temp.last)*/) {
            this.playBut.active = true;
            this.playBut.children[2].active = true;
            this.playBut.children[1].active = false;
            this.playBut.children[0].active = false;

            // tool.last(dataBus)
        } else {
            this.playBut.active = false;
        }
        /*if (dataBus.temp.last === "left" || (!dataBus.temp.last && dataBus.banker === "my")) {
            console.log(dataBus.temp);
            // console.log(dataBus.temp.last === "left", (!dataBus.temp.last && dataBus.banker === "my"), !dataBus.temp.last, dataBus.banker === "my");
            dataBus["myCard"].state = 0;
            this.playBut.active = true;
            if (dataBus.temp.last === "left") {
                this.playBut.children[2].active = false;
                this.playBut.children[1].active = true;
                this.playBut.children[0].active = true;
            } else {
                this.playBut.children[2].active = true;
                this.playBut.children[1].active = false;
                this.playBut.children[0].active = false;
            }
        } else {
            this.playBut.active = false
        }*/
    },
    update(dt) {
        this.head();
        this.playCard();
    },
});
