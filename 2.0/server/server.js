const Koa = require('koa'),
  route = require('koa-route'),
  websockify = require('koa-websocket'),
  session = require("koa-session"),
  utility = require("utility");

let middle = require("./middle")
let tool = require("./methed/tool")
const app = websockify(new Koa());
app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 864000000000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));

const appLink = {
  /**
    * man 保存的是当前的四个人的ID
    * headImg 保存四个人的头像
    * banker 当前的庄
    * cards 四人的牌
    * activeIndex 当前出牌人
    * lastIndex 上次出牌人
    * lastCards
    * 
    */
};
const userLink = {};

// Regular middleware
// Note it's app.ws.use and not app.use

// Using routes
app.ws.use(route.all('/test/:id', function (ctx) {
  // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
  // the websocket is added to the context on `ctx.websocket`.
  ctx.websocket.on('message', function (message) {

    let sendFn = (ids, data) => {
      for (let key of ids) {
        // console.log(key)
        userLink[key].websocket.send(JSON.stringify(data))
      }
    }
    // do something with the message from client
    message = JSON.parse(message)
    // 开房间
    if (message.code === "1001") {
      let houseIndex = null;
      let key = Object.keys(appLink)
      if (key.length) {
        houseIndex = Math.max(...key) + 1
      } else {
        houseIndex = 1
      }
      ctx.session.houseIndex = houseIndex
      let room = {};
      room["man"] = [];
      room["man"].push(ctx);
      if (message.data) {
        room["data"] = [];
        room["data"].push(message.data);
      }
      appLink[houseIndex] = room;
      ctx.websocket.send(JSON.stringify({
        type: "open",
        code: "0000",
        houseIndex
      }));
    }

    // 进入房间
    // https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epS9bXfsQ9F40E6ib71nibWMJibxPZKUIGHhFgDicaq8gxC0y2uWVMCNxHDNWHQq3983kNqoqdRr5Mu6A/132
    if (message.code === "1002") {
      let { houseIndex, id, headImg = "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epS9bXfsQ9F40E6ib71nibWMJibxPZKUIGHhFgDicaq8gxC0y2uWVMCNxHDNWHQq3983kNqoqdRr5Mu6A/132" } = message;
      if (!appLink[houseIndex]) return ctx.websocket.send(JSON.stringify({ code: "0001", msg: "房间已关闭" }))
      if (appLink[houseIndex]["man"].length >= 4) {
        return ctx.websocket.send(JSON.stringify({ code: "0001", msg: "房间已满" }));
      } else if (appLink[houseIndex]["man"].length < 4) {
        if (!id) {
          id = utility.md5(new Date().getTime().toString())
        }

        ctx.session.id = id;
        ctx.session.headImg = headImg;
        userLink[id] = ctx;
        let house = appLink[houseIndex];
        house["man"].push(id);
        house["headImg"].push(headImg);
        let cards, banker;
        if (house["man"].length === 4) {
          cards = tool.createRandom();
          banker = Math.floor(Math.random() * 4)
        }
        house["banker"] = banker;
        house["cards"] = cards;
        house["activeIndex"] = banker;
        house["activeLastIndex"] = banker;
        house["ends"] = [];
        house["lastIndex"] = banker;
        for (let key in house["man"]) {
          let group = { index: key, image: house["headImg"], id: userLink[house["man"][key]].session.id };
          if (cards) {
            group.banker = banker;
            group.activeIndex = banker;
            cards[key].includes(20) ? house.five = key : null;
            group.cards = cards[key];
          }
          let data = { code: "2002", data: group }
          userLink[house["man"][key]].websocket.send(JSON.stringify(data))
        }
      }
      // 出牌逻辑
    }
    // 出牌逻辑
    else if (message.code === "1003") {
      let { cards = [], houseIndex, id, index } = message;
      let house = appLink[houseIndex]

      let newCards = house.cards[index].filter(item => !cards.includes(item.toString()));//判断出的牌是否在牌组里
      if ((house.activeIndex != index)
        || (!cards.length && house.activeLastIndex == index)
        || (cards.length && !tool.compare(cards))
        || (newCards.length + cards.length !== house.cards[index].length))
        return ctx.websocket.send(JSON.stringify({
          code: "0002",
          msg: "当前出牌不合法"
        }))

      else {
        console.log(house.activeIndex, house.activeLastIndex)
        if (house.activeIndex !== house.activeLastIndex && cards.length && !tool.contrast(house.lastCards, cards)) return ctx.websocket.send(JSON.stringify({
          code: "0002",
          msg: "当前出牌不合法1"
        }))
        let activeIndex = tool.nextCard(house.cards, index);//下家出牌
        house.lastIndex = house.activeIndex;
        if (cards.length) {
          house.lastCards = cards
          house.activeLastIndex = house.activeIndex;
        } else if (tool.nextCard(house.cards, house.activeLastIndex) === tool.nextCard(house.cards, index)) {
          house.lastCards = [];
          house.lastIndex = activeIndex;
          house.activeLastIndex = activeIndex;
        }

        house.activeIndex = activeIndex;
        house.cards[index] = newCards;
        if (cards.length && !newCards.length) {
          // house.lastIndex = activeIndex;
          house.ends.push(index)
          let win = tool.victoryOrDefeat(house.banker.toString(), house.five.toString(), house.cards, house.ends);
          if (win.state) {
            return sendFn(house.man, {
              code: "2004",
              data: win
            })
          }
        }
        console.log({
          code: "2003",
          cards,
          lastIndex: house.lastIndex,
          activeIndex
        })
        return sendFn(house.man, {
          code: "2003",
          cards,
          lastIndex: house.lastIndex,
          activeIndex
        })
      }
    }
    // 重新开始
    else if (message.code === "1004") {
      let { houseIndex } = message;
      let cards = tool.createRandom();
      let house = appLink[houseIndex];
      house.plan ? null : house.plan = 0;
      if (house.plan === 4) {
        house.plan = 0;
        let banker = tool.nextCard(appLink[houseIndex].banker, cards);
        house["banker"] = banker;
        house["cards"] = cards;
        house["activeIndex"] = banker;
        house["activeLastIndex"] = banker;
        house["ends"] = [];
        house["lastIndex"] = banker;
        for (let key in house["man"]) {
          let group = { index: key, image: house["headImg"], id: userLink[house["man"][key]].session.id };
          if (cards) {
            group.banker = banker;
            group.activeIndex = banker;
            cards[key].includes(20) ? house.five = key : null;
            group.cards = cards[key];
          }
          let data = { code: "2002", data: group }
          userLink[house["man"][key]].websocket.send(JSON.stringify(data))
        }
      } else {
        house.plan += 1
      }
    }
    //退出房间
    else if (message.code === "1010") {
      let { houseIndex, id } = message;
      let man = appLink[houseIndex].man;
      sendFn(man, {
        code: "2010"
      })
      for (let i in man) {
        delete userLink[man[i]];
      }
      delete appLink[houseIndex];
    }
    // console.log(message);
  });
}));

app.use(route.get("/gethouse", ctx => {
  ctx.set("Access-Control-Allow-Origin", "*")
  let keys = Object.keys(appLink);
  let index = 1;
  let id = ctx.query.id;
  if (keys.length) {
    index = Math.max(keys);
  }
  let userId = null
  if (!id) {
    userId = utility.md5(new Date().getTime().toString())
    ctx.body = JSON.stringify({ index, userId })
  } else {
    ctx.body = JSON.stringify({ index })
  }
  appLink[index] = { man: [], cards: [], headImg: [] };

}))

app.listen(3000);