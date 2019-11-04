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
cc.Class({
    extends: cc.Component,

    properties: {
        cardList: cc.Prefab,
        card: cc.Node,
        nodeName: null,
        text: cc.Label,
        mouseStart: null,
        // tempNum: null,
        image: cc.Sprite,
        num: cc.Label,
        banker: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.bandEvent();
        this.bandCard();
        // this.bandCard([1, 2, 3, 5, 40, 30, 50, 51, 22, 33, 18, 15])
    },
    bandCard() {
        this.nodeName = this.node.name;
        let a = []
        if (this.nodeName !== "my")
            a = dataBus[this.nodeName].cards.data;
        else a = dataBus.myCards.data
        let cardList = cc.instantiate(this.cardList);
        // num, { height, width }, this.actived
        let height = this.node.height;
        let widht = height * .8
        let active = false;
        if (this.nodeName === "my") active = true;
        cardList.getComponent("cardList").draw({ cardAry: a, direction: this.nodeName, size: { height, widht }, active });
        cardList.setPosition(0, 0);
        this.card.addChild(cardList);
    },
    bandEvent() {
        if (this.node.name === "my") {
            this.node.on(cc.Node.EventType.TOUCH_START, (touch, event) => {
                this.mouseStart = this.node.convertToNodeSpaceAR(touch.touch._point);
            });
            this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
                let { eleCards: { cards: eles, num } } = dataBus;
                this.range = touch.x;
                let setp = null;
                let end = this.node.convertToNodeSpaceAR(touch.touch._point);
                if (eles.length > 1) {
                    setp = eles[1].getPosition().x - eles[0].getPosition().x;
                }
                let last = null;
                eles.reduceRight((last, pre, index, ary) => {
                    let position = cc.v2(pre.getPosition())
                    let { width, height } = pre;
                    if (last.x) {
                        width = last.x - pre.x;
                    }
                    let react = [cc.v2(position.x, position.y)];
                    react.push(cc.v2(position.x, position.y + height))
                    react.push(cc.v2(position.x + width, position.y + height))
                    react.push(cc.v2(position.x + width, position.y))
                    if ((cc.Intersection.linePolygon(this.mouseStart, end, react))) {
                        if (!dataBus.eleCards.template) dataBus.eleCards.template = {};
                        if (dataBus.eleCards.template[num[index]]) {
                            delete dataBus.eleCards.template[num[index]]
                        } else {
                            dataBus.eleCards.template[num[index]] = num[index];
                        }
                        pre.getComponent("card").setPint();
                    } else if (cc.Intersection.pointInPolygon(this.mouseStart, react)) {
                        if (!dataBus.eleCards.template) dataBus.eleCards.template = {};
                        if (dataBus.eleCards.template[num[index]]) {
                            delete dataBus.eleCards.template[num[index]]
                        } else {
                            dataBus.eleCards.template[num[index]] = num[index];
                        }
                        pre.getComponent("card").setPint();
                    }
                    return pre;
                }, {});
                // dataBus.eleCards.template = this.tempNum;
            })
        }
    },
    update(dt) {
        if (this.node.name !== "my") {
            if (dataBus[this.node.name].updata) {
                let node = dataBus[this.node.name];
                node.updata = false;
                if (node.cards.updata) {
                    // node.cards.updata = false;
                    // this.bandCard(node.cards.data);
                    this.text.string = node.cards.text;
                    if (this.node.name !== "center") {
                        this.num.string = node.cards.num
                    }
                }
                if (this.node.name !== "center") {
                    if (node.imageSrc.updata) {
                        node.imageSrc.updata = false;
                        // var remoteUrl = "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epS9bXfsQ9F40E6ib71nibWMJibxPZKUIGHhFgDicaq8gxC0y2uWVMCNxHDNWHQq3983kNqoqdRr5Mu6A/132#a.png";
                        node.imageSrc.data && cc.loader.load({ url: node.imageSrc.data + "#a.png", type: "png" }, (err, texture) => {
                            // cc.loader.releaseAsset(this.image.spriteFrame);
                            // this.image.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            this.image.spriteFrame = new cc.SpriteFrame(texture)
                        });;
                    }
                    if (node.banker && !this.banker.string.includes("庄")) {
                        this.banker.string = "庄"
                    }
                    if (node.spade && !this.banker.string.includes("♠")) {
                        this.banker.string += " ♠"
                    }
                }
            }
        } else {
            if (dataBus.myCards.updata) {
                let slef = dataBus.myCards
                slef.updata = false;
                // this.bandCard(slef.data);
                let str = ""
                if (slef.banker)
                    str = "庄/"
                else
                    str = "平家/"
                if (slef.spade)
                    str += "♠/"

                str += "牌：" + slef.cards.data.length;
                this.banker.string = str;
            }
        }
    },
});
