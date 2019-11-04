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
import {SOCKET} from "../public"

cc.Class({
    extends: cc.Component,

    properties: {
        butLabel: cc.Label,
        queryBut: cc.Sprite,
        openBut: cc.Sprite,
        propLabel: cc.Label,
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
    state: 0,
    /*
    * 0 是首页 没有操作时
    * 1 是快速开始
    * 2 是开房间
    * */
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.propLabel.node.active = false;
    },

    start() {
        let {app} = dataBus;
        this.queryBut.node.on("touchstart", () => {
            if (!this.state) {
                this.state = 1;
                this.openBut.node.active = false;
                this.butLabel.string = "匹配中...";
                app.send({state: 1});
                app.message(function (data) {
                    data = JSON.parse(data.data);
                    if (data.state === 10) {
                        let ary = ["right", "top", "left"];
                        let {index, spade, banker, current, cards, imgSrc} = data;
                        dataBus.spade = spade;
                        dataBus.banker = banker;
                        dataBus.current = current;
                        dataBus.nextIndex = current;
                        dataBus.index = index;
                        dataBus.cards = {
                            cards: cards[index],
                            update: true,
                        };
                        dataBus.centerCards = {
                            cards: [],
                            update: true
                        };
                        for (let i = 0; i < dataBus.pNum - 1; i++) {
                            index = ++index === 4 ? 0 : index;
                            dataBus.consult [index] = ary[i];
                            dataBus.cf [ary[i]] = index;
                            dataBus[ary[i]] = {
                                imgSrc: imgSrc[index],
                                cards: cards[index],
                                update: true
                            }
                        }
                        dataBus.mode = {
                            update: true,
                            page: "being"
                        };
                    }
                })
            } else {
                this.state = 0;
                this.openBut.node.active = true;
                this.butLabel.string = "快速开始";
                if (dataBus.mode.page === "index") {
                    app.send({state: 2});
                }
            }
        });
        // this.openBut.node.on("touchstart", () => {
        //     dataBus.mode = {
        //         update: true,
        //         page: "invitation"
        //     };
        // });
    },

    // update (dt) {},
});
