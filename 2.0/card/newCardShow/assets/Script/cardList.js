import dataBus from "./dataBus"
cc.Class({
    extends: cc.Component,
    properties: {
        card: cc.Prefab,
        eles: [],
        num: [],
        obj: null
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

    },
    draw(obj) {
        // this.direction = direction !== "my" ? direction : "myCards";
        this.node.removeAllChildren();
        let { cardAry, direction, size: wh, active = false } = obj
        obj.direction = direction !== "my" ? direction : "myCards";
        this.obj = obj;
        if (!cardAry) return false
        let size = size ? .8 : 1;
        let { height, width } = wh;
        if (active) {
            height *= .8;
        }
        width = height * .8;
        let step = width * .3;
        // let start = this.node.width / 2 - (((cards.length) * width * .3 - width + width * .3) / 2);
        let winSize = cc.winSize.width
        let start = direction === "left" ? 0
            : direction === "right" ? -(cardAry.length - 1) * width * .3 - width :
                this.node.width / 2 - (((cardAry.length) * width * .3 + width * .6) / 2);
        let objEle = { cards: [], num: [] };
        cardAry.sort((a, b) => a - b);
        cardAry.forEach((num, index) => {
            let card = cc.instantiate(this.card);
            console.log(active)
            card.getComponent("card").setNum({ num, size: { height, width }, actived: active });
            card.setPosition(start, 0);
            start += step;
            this.node.addChild(card);
            if (active) {
                objEle.cards.push(card);
                objEle.num.push(num);
            }
        });
        if (active) {
            dataBus.eleCards = Object.assign(dataBus.eleCards, objEle)
        }
    },
    // upData() {
    //     // console.log(this.obj.direction)
    //     // console.log(dataBus[this.obj.direction].updata)
    //     // dataBus[this.obj.direction].cards.updata = false;
    //     this.obj.cardAry = dataBus[this.obj.direction].cards.data;
    //     this.draw(this.obj);
    // },
    update(dt) {
        if (this.obj) {
            // console.log(this.obj.direction)
            // console.log(dataBus[this.obj.direction].updata)
            if (dataBus[this.obj.direction].cards.updata) {
                dataBus[this.obj.direction].cards.updata = false;
                this.obj.cardAry = dataBus[this.obj.direction].cards.data;
                this.draw(this.obj);
            }
        }

    },
});
