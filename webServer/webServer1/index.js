var _ = require('koa-route');
var Koa = require('koa');
const mongo = require("koa-mongo");
const websockify = require('koa-websocket');
const session = require("koa-session");

const tool = require("./tool");

const app = websockify(new Koa());
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess',
    /** (string) cookie key (default is koa:sess) */
    autoCommit: true,
    /** (boolean) automatically commit headers (default true) */
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));

/*app.ws.use(mongo({
    uri: 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb',
    port: 27017,
    db: 'test',
}));*/

/*
var a = {
    link: [{ctx:"house"}],//四个用户
    userId: [],//用户ID
    cards: [[], [], [], []],//牌组
    currentCards: [],//牌组
    banker:"",//庄家
    spade:"",//黑五
    current:"",//当前出牌人,
    nextIndex
    currentCard:"",
    outContact:[],//掉线
    times:"",
    ends:[]
};
*/


const appLink = {plan: [], 4: {}};//存储已连接的对象
const invite = {};//存储已连接的对象


app.ws.use(function (ctx, next) {
    return next(ctx)
});

app.ws.use(_.all('/test/:id', async (ctx) => {
    ctx.websocket.on('message', async (message) => {
        // 返回给前端的数据
        // ctx.socket.send(message);
        message = JSON.parse(message);
        // console.log(message);
        let {state} = message;//获取当前发送的状态
        let houseIndex = ctx.session.houseIndex;//获取当前的房间号码
        //表示快速匹配
        if (state === 1) {
            let {houseImageSrc, id} = message;
            ctx.session.houseImageSrc = houseImageSrc || "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epS9bXfsQ9F40E6ib71nibWMJibxPZKUIGHhFgDicaq8gxC0y2uWVMCNxHDNWHQq3983kNqoqdRr5Mu6A/132?aa=aa.jpg";
            let plan = appLink.plan;
            ctx.session.id = id || "";
            ctx.session.index = plan.length;
            plan.push(ctx);
            if (plan.length === 4) {
                let {length: lg} = Object.keys(appLink[4]);
                appLink[4][lg] = {};
                let link = plan;
                appLink.plan = [];

                // 发牌
                let cards = tool.createRandom(52);
                let banker = Math.floor(Math.random() * 4);//
                let spade = Math.floor(Math.random() * 4);
                let current = banker;//出牌人
                let sendData = {banker, spade, current, state: 10};
                sendData["imgSrc"] = [];
                // appLink[3][i].websocket.send(JSON.stringify(data));
                for (let i = 0; i < 4; i++) {
                    sendData["imgSrc"].push(link[i].session.houseImageSrc);
                }
                for (let i = 0; i < 4; i++) {
                    sendData["index"] = i;//当前人的索引
                    let cardsNum = [];
                    for (let j = 0; j < 4; j++) {
                        cardsNum[j] = i === j ? cards[j] : 13;
                    }
                    sendData["cards"] = cardsNum;
                    link[i].session.houseIndex = lg;
                    link[i].session.index = i;
                    link[i].websocket.send(JSON.stringify(sendData))
                }
                appLink[4][lg] = {
                    link,
                    userId: [],//用户ID
                    cards,//牌组
                    banker,//庄家
                    spade,//黑五
                    current,//当前出牌人
                    nextIndex: current,//当前出牌人
                    outContact: [],//掉线
                    times: "",
                    ends: []
                }
            }
            /*for (let i = 3; i >= 1; i--) {
                if (appLink[i].length) {
                    appLink[i].push(ctx);
                    if (i + 1 !== 4) {
                        appLink[i + 1] = appLink[i];
                    } else {
                        let {length: lg} = Object.keys(appLink[4]);
                        appLink[4][lg] = {};
                        let link = appLink[i];
                        for (let i = 3; i >= 1; i--) {
                            appLink[i] = [];
                        }

                        // 发牌
                        let cards = tool.createRandom(52);
                        let banker = Math.floor(Math.random() * 4);//
                        let spade = Math.floor(Math.random() * 4);
                        let current = banker;//出牌人
                        let sendData = {banker, spade, current};
                        sendData["imgSrc"] = [];
                        // appLink[3][i].websocket.send(JSON.stringify(data));
                        for (let i = 0; i < 4; i++) {
                            sendData["imgSrc"].push(link[i].session.houseImageSrc);
                        }
                        for (let i = 0; i < 4; i++) {
                            sendData["index"] = i;//当前人的索引
                            let cardsNum = [];
                            for (let j = 0; j < 4; j++) {
                                cardsNum[j] = i === j ? cards[j] : 13;
                            }
                            sendData["cards"] = cardsNum;
                            link[i].session.houseIndex = lg;
                            link[i].session.index = i;
                            link[i].websocket.send(JSON.stringify(sendData))
                        }
                        appLink[4][lg] = {
                            link,
                            userId: [],//用户ID
                            cards,//牌组
                            banker,//庄家
                            spade,//黑五
                            current,//当前出牌人
                            outContact: [],//掉线
                            times: ""
                        }
                    }
                } else if (i === 2) {
                    appLink[i].push(ctx);
                }
            }*/
        }
        // 取消匹配
        else if (state === 2) {
            let {index, id} = ctx.session;
            let {plan} = appLink;
            let flag = false;
            appLink.plan = plan.filter((item, key) => {
                if (key === index) {
                    flag = true;
                }
                if (flag) {
                    item.session.index = item.session.index - 1;
                }
                return key !== index
            });
            /* if (plan[index].session.id === id) {
                 appLink.plan = plan.filter((item, key) => {
                     return key !== index
                 });
                 console.log(appLink.plan.length);
                 // ctx.socket.send(JSON.stringify({state: 20, msg: "取消成功"}))
             } else {
                 ctx.socket.send(JSON.stringify({state: 21, msg: "不能取消"}))
             }
 */
        }
        //出牌
        else if (state === 3) {

            /*            {
                            index: "i"//出牌索引
                            cards: []
                        }*/
            let {data: {index: currentIndex, cards}} = message;
            let {link, cards: serverCards, current, currentCards, nextIndex: nextI} = appLink[4][houseIndex];
            let nextIndex = tool.nextCard(serverCards, currentIndex);
            let cardsUp = tool.compare(cards);
            let serverCardsUp = tool.compare(currentCards || []);

            let {index} = ctx.session;
            console.log("条件一：current" + current + "nextI" + nextI);
            if ((!currentCards || currentCards.length === 0) && (current === nextI) && tool.compare(cards) && cards.every(item => serverCards[currentIndex].includes(item))) {
                console.log(currentIndex === current, serverCards[current].length === 0);
                message.data.nextIndex = nextIndex;
                appLink[4][houseIndex].currentCards = cards;
                appLink[4][houseIndex].nextIndex = nextIndex;
                appLink[4][houseIndex].current = currentIndex;
                console.log(3);
                serverCards[currentIndex] = serverCards[currentIndex].filter(item => !cards.includes(item));
                for (let i = 0; i < serverCards.length; i++) {
                    if (index === i) {
                        message.data.card = serverCards[currentIndex];
                        link[i].websocket.send(JSON.stringify(message))
                    } else {
                        message.data.card = serverCards[currentIndex].length;
                        link[i].websocket.send(JSON.stringify(message))
                    }
                }
            } else if (nextI === currentIndex && serverCardsUp && cardsUp && tool.contrast(serverCardsUp, cardsUp)) {
                console.log(2);
                message.data.nextIndex = nextIndex;
                appLink[4][houseIndex].currentCards = cards;
                appLink[4][houseIndex].nextIndex = nextIndex;
                appLink[4][houseIndex].current = currentIndex;
                serverCards[currentIndex] = serverCards[currentIndex].filter(item => !cards.includes(item));
                for (let i = 0; i < serverCards.length; i++) {
                    if (index === i) {
                        message.data.card = serverCards[currentIndex];
                        link[i].websocket.send(JSON.stringify(message))
                    } else {
                        message.data.card = serverCards[currentIndex].length;
                        link[i].websocket.send(JSON.stringify(message))
                    }
                }
            } else if (cards.length === 0) {
                console.log(current, nextIndex);
                if (current === nextIndex) {
                    appLink[4][houseIndex].currentCards = [];
                }

                message.data.nextIndex = nextIndex;
                appLink[4][houseIndex].nextIndex = nextIndex;
                for (let i = 0; i < serverCards.length; i++) {
                    if (index === i) {
                        if (currentIndex < current && current < nextIndex) {
                            message.data.newC = 1;
                        }
                        message.data.card = serverCards[currentIndex];
                        link[i].websocket.send(JSON.stringify(message))
                    } else {
                        message.data.newC = 0;
                        message.data.card = serverCards[currentIndex].length;
                        link[i].websocket.send(JSON.stringify(message))
                    }
                }
                // console.log(message);
            } else {
                ctx.websocket.send(JSON.stringify({state: 201}))
            }
        }
        else if (state === 4) {
            console.log(houseIndex)
        }

    });
    ctx.socket.on('close', function (data) {
        console.log("close:" + data);
    })
}))
;

app.listen(3000);
console.log('listening on port 3000');
