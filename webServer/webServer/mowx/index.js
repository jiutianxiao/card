var _ = require('koa-route');
var Koa = require('koa');
const mongo = require("koa-mongo");
const websockify = require('koa-websocket');
const session = require("koa-session");

const tool = require("./tool");

const appLink = {1: [], 2: [], 3: [], 4: {}};//存储已连接的对象
const invite = {};//存储已连接的对象

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
app.ws.use(function (ctx, next) {
    return next(ctx)
});

app.ws.use(_.all('/test/:id', async (ctx) => {
    ctx.websocket.on('message', async (message) => {
        // 返回给前端的数据
        console.log(message);
        let {state} = JSON.parse(message);//获取当前发送的状态
        let houseIndex = ctx.session.houseIndex || false;//获取当前的房间号码
        if (state === 1) {//表示快速匹配或者换桌
            let {houseImageSrc} = JSON.parse(message);
            ctx.session.houseImageSrc = houseImageSrc || "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epS9bXfsQ9F40E6ib71nibWMJibxPZKUIGHhFgDicaq8gxC0y2uWVMCNxHDNWHQq3983kNqoqdRr5Mu6A/132?aa=aa.jpg";
            for (let i = 3; i >= 0; i--) {
                if (i === 0) {
                    appLink[1].push(ctx);
                    ctx.session.id = i
                } else if (appLink[i].length) {
                    appLink[i].push(ctx);
                    if (i + 1 !== 4) {
                        appLink[i + 1] = appLink[i];
                    } else if (i + 1 === 4) {
                        let keys = Object.keys(appLink[4]);
                        keys = keys.length ? Math.max(...keys) : 1;
                        let index = keys + 1;
                        appLink[4][index] = appLink[i];
                        let cards = tool.createRandom();
                        let banker = Math.ceil(Math.random() * 4);
                        banker = 0;
                        let spade = null;
                        appLink[3][0].session.rest = 0;
                        for (let i = 0; i < 4; i++) {
                            appLink[3][i].session.houseIndex = index;
                            appLink[3][i].session.banker = banker;
                            appLink[3][i].session.cards = cards[i];
                            let src = [];
                            let send = [];
                            for (let j = 0; j < 4; j++) {
                                if (i === j) {
                                    send.push(cards[i]);
                                } else send.push(13);
                                if (!spade && cards[j].includes(20)) {
                                    spade = j;
                                }
                                let {houseImageSrc} = appLink[3][i].session;
                                src.push(houseImageSrc);
                            }
                            let data = {cards: send, banker, src, index: i, state: 1, spade};
                            appLink[3][i].websocket.send(JSON.stringify(data));
                        }
                        appLink[1] = [];
                        appLink[2] = [];
                        appLink[3] = [];
                        console.log(ctx.session.houseIndex);
                    }
                    i = -1;
                    appLink[i] = [];
                }
            }
        } else if (state === 2) {
            //准备
            let {index} = JSON.parse(message);
            ++appLink[4][houseIndex][0].rest;
            if (appLink[4][houseIndex][0].rest !== 4) {
                for (let i = 0; i < 4; i++) {
                    appLink[4][houseIndex][i].websocket.send(JSON.stringify({
                        state: 2,
                        index
                    }));
                }
            } else {
                let cards = tool.createRandom();
                let {banker} = appLink[3][i].session;
                if (++banker === 4) {
                    banker = 0;
                }
                for (let i = 0; i < 4; i++) {
                    appLink[4][houseIndex][i].session.houseIndex = index;
                    appLink[4][houseIndex][i].session.banker = banker;
                    appLink[4][houseIndex][i].session.cards = cards[i];
                    let src = [];
                    let send = [];
                    for (let j = 0; j < 4; j++) {
                        if (i === j) {
                            send.push(cards[i]);
                        } else send.push(13);
                        if (!spade && cards[j].includes(20)) {
                            spade = j;
                        }
                        let {houseImageSrc} = appLink[3][i].session;
                        src.push(houseImageSrc);
                    }
                    let data = {cards: send, banker, src, index: i, state: 1, spade};
                    appLink[4][houseIndex][i].websocket.send(JSON.stringify(data));
                }
            }
        } else if (state === 3) {
            //出牌
            console.log(1);
            let {cards, index} = JSON.parse(message);
            console.log(houseIndex, index);
            let serverCards = appLink[4][houseIndex][index].session.cards;
            for (let key in cards) {
                let temp = [];
                temp = serverCards.filter(item => {
                    return item !== cards[key];
                });
                serverCards = temp;
                temp = null;
            }
            console.log(serverCards);
            appLink[4][houseIndex][index].session.cards = serverCards;
            for (let i = 0; i < 4; i++) {
                if (index === i) {
                    appLink[4][houseIndex][i].websocket.send(JSON.stringify({
                        "state": 3,
                        "cards": cards,
                        "index": index,
                        myCards: serverCards
                    }));
                } else
                    appLink[4][houseIndex][i].websocket.send(message);
            }
        } else if (state === 5) {
            //换桌
            let {id} = ctx.session;
            if (appLink[1].length === 1) {
                appLink[1] = [];
            } else {
                let ary = [];
                for (let i = 0; i < appLink[1].length; i++) {
                    if (i !== id) {
                        ary.push(appLink[1][i]);
                        appLink[1][i].session.id = i;
                    }
                }
                appLink[1] = ary;
            }
        } else if (state === 6) {
            //取消换桌或者取消快速开始
            let {index} = JSON.parse(message);
            for (let i = 0; i < 4; i++) {
                if (i !== index) {
                    appLink[4][houseIndex][i].websocket.send(JSON.stringify({state: 4}))
                    // appLink[4][houseIndex]
                }
            }
            delete appLink[4][houseIndex]
        }
        /*                if (state === 1) {//表示快速匹配或者换桌
                            let house = "0";
                            let key = 0;
                            for (key in appLink) {
                                if (appLink[key].num !== 4 && key !== house) {
                                    house = key;
                                }
                            }
                            if (key !== house) {
                                house = key + 1;
                            }
                            ctx.session['house'] = house;

                            if (appLink[house]) {
                                let Len = ++appLink[house].num;

                                for (let key = 0; key < Len; key++) {
                                    if (!appLink[house].house[key]) {
                                        appLink[house].house[key] = ctx;
                                        appLink[house].state[key] = 1;
                                        ctx.session['num'] = key;
                                    }
                                    appLink[house].house[key].websocket.send(111);
                                }
                            } else {
                                appLink[house] = {};
                                appLink[house] = {
                                    house: [],
                                    multiple: 0,
                                    num: 1,
                                    state: [1]
                                };
                                ctx.session['num'] = 0;
                                appLink[house].house.push(ctx);
                                appLink[house].house[0].websocket.send(11)
                            }
                            let peopleNum = appLink[key] ? appLink[key].num : 0;
                            ctx.session.index=peopleNum;
                            if (peopleNum === 4) {
                                let cards = tool.createRandom();
                                for (let i = 0; i < 4; i++) {
                                    appLink[house].state[i] = 3;
                                    appLink[house].house[i].session["cards"] = cards[i];
                                    appLink[house].house[i].session["cardsNum"] = [13, 13, 13, 13];
                                    appLink[house].house[i].websocket.send(JSON.stringify({
                                        cards: cards[i],
                                        cardsNum: [13, 13, 13, 13],
                                        my:appLink[house].house[i].session.num
                                    }))
                                }
                            }


                            // for(team)
                        }
                        else if (Number(state) === 2) {//准备，如果全部准备完成，则开始发牌
                            let {house, num} = ctx.session;
                            appLink[house].state[num] = 2;
                            let tag = 0;
                            for (let i = 0; i < appLink[house].num; i++) {
                                if (appLink[house].state[i] === 2) {
                                    tag++;
                                }
                            }

                            if (tag === 4) {
                                let cards = tool.createRandom();
                                for (let i = 0; i < 4; i++) {
                                    appLink[house].state[i] = 3;
                                    appLink[house].house[i].session["cards"] = cards[i];
                                    appLink[house].house[i].session["cardsNum"] = [13, 13, 13, 13];
                                    appLink[house].house[i].websocket.send(JSON.stringify({
                                        cards: cards[i],
                                        cardsNum: [13, 13, 13, 13]
                                    }))
                                }
                            } else {
                                for (let i = 0; i < appLink[house].num; i++) {
                                    appLink[house].house[i].websocket.send(appLink[house].state)
                                }
                            }
                        }
                        else if (state === 3) {//出牌阶段
                            let {last, current} = message;
                            let {house, num} = ctx.session;

                            last = tool.compare(last);
                            current = tool.compare(current);
                            if (!current) {
                                // 没有出牌,过
                            }
                            if (!last) {
                                //说明第一个出牌，直接过
                            }

                            if (tool.contrast(last, current)) {
                                // 说明可以管住，
                            } else {
                                // 说明管不住
                            }
                        }*/
        /*
                const result = await ctx.db.collection('users').insert({name: ctx.websocket});
                const userId = result.ops[0]._id.toString();
                var a = await ctx.db.collection('users').find().toArray();
                ctx.websocket.send(message);
                ctx.db.collection('users').remove()

                */
    });
}));

app.listen(3000);
console.log('listening on port 3000');