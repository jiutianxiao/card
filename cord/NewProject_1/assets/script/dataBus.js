// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

export default {
    but: {
        max: {
            width: 270,
            height: 68
        },
        min: {
            width: 72,
            height: 30
        }
    },
    card: {
        max: {
            width: null,
            height: null
        },
        min: {
            width: null,
            height: null
        },
    },
    myCard: {
        cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        cardStart: true,
        tempCard: [],
        state: 0,//1：是准备 2是不出
        update: true,//true是更新，false是没有更新
    },
    center: {
        cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        cardStart: true,
    },
    rest: false,
    state: "startSelect",
    socket: null,
    createdSocket(data) {
        this.socket = wx.connectSocket({
            url: 'ws://127.0.0.1:3000/test/123',
            method: 'GET',
            success(data) {
                console.log(data);
            },
            faill() {
            }
        });
        /*        this.socket.onOpen((data) => {
                    this.send({
                        data: JSON.stringify(data),
                        success(data) {
                            console.log("成功");
                        },
                        fail(err) {
                            console.log("网络错误");
                            console.log(err);
                        }
                    })
                })*/
        /*        wx.getUserInfo({
                    openIdList: ['selfOpenId'],
                    lang: 'zh_CN',
                    success(res) {
                        console.log('success', res.data)
                    },
                    fail(res) {
                        console.log("没有授权");
                        reject(res)
                    }
                })*/

    },
    openState: null,
    top: {
        state: 0,
        src: "",
        update: false,
        cardNum: 0,
    },
    left: {
        state: 0,
        src: "",
        update: false,
        cardNum: 13,
    },
    right: {
        state: 0,
        src: "",
        update: false,
        cardNum: 6,
    },
    my: {
        state: 0,
        update: true,
    },
    ele: ["top", "left", "right"],
    temp: {
        last: "",
        lastIndex: "",//操作的上一家
        index: "",//出牌的上一家
        cards: [],
        dealer: "",
        update: false
    },
    banker: null,
    upper: "",//上家
    spade: {
        state: 0,//0是没有出现黑五，1是出现了黑五
        index: null
    },
    gameState: {
        invitation: "",
        game: ""
    },
    pFlip: {},
    position: {},
    index: null,
    positionIndex: {},
    finishIndex: [],
    lowOrWin: {}
}
