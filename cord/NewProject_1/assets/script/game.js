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
import tool from "../tool"

cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Sprite,
        title: cc.Sprite,
        startSelect: cc.Prefab,
        openHouse: cc.Prefab,
        quickStart: cc.Prefab,
        rest: cc.Prefab,
        tag: null
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
        this.socketMessage();
    },
    socketMessage() {
        wx.onSocketMessage(data => {
                data = JSON.parse(data.data);
                let {state} = data;
                if (state === 1) {
                    //发牌
                    let position = ["my", "right", "top", "left"];
                    let {index, banker, cards, src, spade} = data;
                    dataBus.index = index;
                    dataBus.myCard.cards = cards[index].sort((a, b) => a - b);
                    dataBus.myCard.update = true;
                    dataBus.upper = tool.upper(index);
                    for (let i = 0; i < 4; i++) {
                        dataBus.position[index] = position[i];
                        dataBus.pFlip[position[i]] = index;
                        dataBus.positionIndex[index] = i;
                        if (i !== 0) {
                            dataBus[position[i]]["src"] = src[index];
                            dataBus[position[i]]["cardNum"] = cards[index];
                            dataBus[position[i]].update = true;
                        }
                        index++;
                        index = index === 4 ? 0 : index;
                    }
                    dataBus.temp.last = dataBus.positionIndex[3];
                    dataBus.spade.index = dataBus.position[spade];
                    dataBus.banker = dataBus.position[banker];
                    dataBus.state = "openHouse";
                } else if (state === 2) {
                    //准备
                    let {index} = data;
                    if (dataBus.position[index] === "my") {
                        dataBus.myCard.update = true;
                        dataBus.myCard.state = 1;
                    } else {
                        dataBus[dataBus.position[index]].update = true;
                        dataBus[dataBus.position[index]].state = 1;
                    }
                } else if (state === 3) {
                    // 出牌
                    let {index, cards, myCards} = data;
                    let position = dataBus.position[index];
                    if (cards && cards.includes(20)) dataBus.spade.state = 1;
                    if (cards && cards.length) {
                        if (dataBus.position[index] === "my") {
                            dataBus.myCard.cards = myCards.sort((a, b) => a - b);
                            dataBus.myCard.update = true;
                            dataBus.myCard.tempCard = [];
                        } else {
                            dataBus[position].cardNum -= cards.length;
                            dataBus[position].update = true;
                        }
                        if (dataBus[position].cardNum === 0) {
                            console.log("出完牌了", dataBus.finishIndex);
                            if (index === dataBus.upper) {
                                dataBus.upper = tool.upper(index);
                            }
                            dataBus.finishIndex.push(index);

                            /*                            if (dataBus.banker === dataBus.spade) {

                                                        }*/
                            // console.log("winOrLow" + JSON.stringify(tool.winOrLow()));
                            if (tool.winOrLow()) {
                                dataBus.lowOrWin = tool.winOrLow();
                                // dataBus.state = "rest";
                                dataBus.rest = true;
                            }
                        }
                        let {last} = dataBus.temp;
                        if (last - dataBus.positionIndex[index] === 1 && dataBus[dataBus.position[last]].cardNum === 0) {
                            last = index;
                        }
                        let {temp} = dataBus;
                        dataBus.temp = {
                            last,
                            dealer: position,
                            index,
                            lastIndex: index,
                            cards,
                            update: true
                        };
                        for (let key in dataBus.position) {
                            if (dataBus.position[key] === "my") {
                                dataBus.myCard.update = true;
                                dataBus.myCard.state = 0;
                            } else {
                                dataBus[dataBus.position[key]].update = true;
                                dataBus[dataBus.position[key]].state = 0;
                            }
                        }
                    } else {
                        if (position === "my") {
                            position = "myCard";
                        }
                        dataBus[position].update = true;
                        dataBus[position].state = 2;
                        let {temp} = dataBus
                        temp.lastIndex = index;
                        temp.update = true;
                        let tempIndex = null;
                        if (dataBus.finishIndex.includes(dataBus.upper)) {
                            tempIndex = dataBus.upper + 1;
                        } else if (dataBus.finishIndex.includes(dataBus.upper + 1)) {
                            tempIndex = dataBus.upper + 2;
                        }
                        tempIndex = tempIndex === 4 ? 0 : tempIndex;
                        console.log(temp.index, tempIndex, temp.index === tempIndex);

                        console.log('清空牌：' + dataBus.upper, index, tool.numMid(index, temp.index));
                        if (dataBus.upper === index && tool.numChange(index, temp.index)) {
                            // console.log("清空牌");
                            // dataBus.temp.cards = [];
                            /*                        }

                                                    if (temp.index === tempIndex) {*/
                            for (let key in dataBus.position) {
                                let position = dataBus.position[key];
                                if (position === "my") {
                                    position = "myCard";
                                }
                                dataBus[position].update = true;
                                dataBus[position].state = 0;
                            }
                            dataBus.temp.cards = [];
                            dataBus.temp.update = true;
                            dataBus.temp.dealer = "my";
                        }
                    }
                    console.log(dataBus);
                } else if (state === 4) {
                    dataBus.state = "startSelect";
                    wx.closeSocket();
                }
            }
        )
    },
    messageFn() {
    },
    update(dt) {
        if (this.tag !== dataBus.state) {
            this.tag = dataBus.state;
            this.node.removeAllChildren();
            let ele = cc.instantiate(this[this.tag]);
            this.node.addChild(ele);
        }
    },
});
